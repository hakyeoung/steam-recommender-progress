import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { rank, terms, validateCorpus } from '../public/demo/search.mjs';
const data=validateCorpus(JSON.parse(await readFile(new URL('../public/demo/data/corpus.json',import.meta.url),'utf8')));
const {fixtures}=JSON.parse(await readFile(new URL('../public/demo/data/python-rankings.json',import.meta.url),'utf8'));

for(const f of fixtures){
  test(`Python parity: ${f.game_id}/${f.scope}/${f.key}`,()=>{
    const ps=data.paragraphs.filter(p=>p.game_id===f.game_id&&(f.scope==='all'||p.source_type===f.scope));
    const actual=rank(ps,f.query);
    assert.equal(actual.length,f.results.length);
    actual.forEach((r,i)=>{assert.equal(r.paragraph.paragraph_id,f.results[i].paragraph_id);assert.ok(Math.abs(r.score-f.results[i].score)<1e-10);});
  });
}
test('query changes compute different results from the same real corpus',()=>{
  for(const game of data.games){
    const ps=data.paragraphs.filter(p=>p.game_id===game.id);
    const ids=q=>rank(ps,q).map(r=>r.paragraph.paragraph_id);
    assert.notDeepEqual(ids('passive item'),ids('effect stacking'));
    assert.notDeepEqual(ids('boon replacement'),ids('weapon interaction'));
  }
});
test('empty source, no-match, empty and unsupported language return no fabricated result',()=>{
  assert.deepEqual(rank([], 'passive item'),[]);
  for(const q of ['', '효과 누적', 'zzzzunfindabletokenzzzz'])assert.deepEqual(rank(data.paragraphs,q),[]);
  assert.deepEqual(terms('PASSIVE-item 12 효과'),['passive','item']);
});
test('collected paragraph hashes, source references and game isolation',()=>{
  const docs=new Map(data.documents.map(d=>[d.document_id,d]));
  for(const p of data.paragraphs){
    assert.equal(createHash('sha256').update(p.text).digest('hex'),p.text_sha256);
    assert.equal(docs.get(p.document_id).url,p.source_url);
    assert.equal(docs.get(p.document_id).game_id,p.game_id);
    assert.ok(p.normalized_line_start>0);
  }
  for(const g of data.games){
    assert.equal(data.paragraphs.filter(p=>p.game_id===g.id).length,g.paragraph_count);
    assert.ok(rank(data.paragraphs.filter(p=>p.game_id===g.id),'passive item').every(r=>r.paragraph.game_id===g.id));
  }
});
test('audit examples are linked to real text, with historical review scope preserved',()=>{
  assert.equal(data.audit.summary.reviewer_kind,'agent');
  assert.equal(data.audit.summary.independent_human_review,false);
  assert.equal(data.audit.summary.precision_and_global_recall,null);
  for(const e of data.audit.evidence){
    const p=data.paragraphs.find(p=>p.paragraph_id===e.paragraph_id);
    assert.ok(p.text.includes(e.anchor));
    assert.equal(p.text,e.paragraph_text);
  }
  for(const a of data.audit.assessments){
    const ranked=rank(data.paragraphs.filter(p=>p.game_id===Number(a.game_id)&&(a.scope==='all_sources_as_search_cli'||p.source_type==='official')),a.query);
    assert.equal(ranked[Number(a.rank)-1].paragraph.paragraph_id,a.paragraph_id);
  }
});
test('invalid schema and orphan paragraphs fail closed',()=>{
  assert.throws(()=>validateCorpus({}));
  assert.throws(()=>validateCorpus({...data,data_kind:'mock'}));
  assert.throws(()=>validateCorpus({...data,paragraphs:[{...data.paragraphs[0],document_id:'missing'}]}));
  assert.throws(()=>validateCorpus({...data,paragraphs:[data.paragraphs[0],data.paragraphs[0]]}));
});
test('export excludes request/config/env fields, local identity paths and secret-like material',()=>{
  for(const d of data.documents){
    for(const key of ['source_path','api_key','steamid','request','review_id'])assert.ok(!(key in d));
    assert.equal(d.data_kind,'collected_source');
  }
  const json=JSON.stringify(data);
  assert.doesNotMatch(json,/sk-(?:proj-)?[A-Za-z0-9_-]{24,}/);
  // Public patch notes contain an example C:\\Users\\YOURUSERNAME path; preserve source text.
  assert.ok(!/[A-Z]:\\\\(?:gamer_recommend|Users\\\\이학영)/.test(json),'No private workspace/identity path');
  assert.equal(data.api_calls_performed,0);
});
