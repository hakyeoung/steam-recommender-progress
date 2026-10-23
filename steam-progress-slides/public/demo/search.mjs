// Faithful port of game_features/retrieve.py::terms/rank. No generated answers.
export const terms = text => text.toLowerCase().match(/[a-z]+/g) || [];
export function rank(paragraphs, query) {
  if (!paragraphs.length) return [];
  const tokens = paragraphs.map(p => terms(p.title + ' ' + p.text));
  const average = tokens.reduce((n, ts) => n + ts.length, 0) / Math.max(1, tokens.length);
  const wanted = [...new Set(terms(query))];
  const dfs = new Map(wanted.map(w => [w, tokens.filter(ts => ts.includes(w)).length]));
  return paragraphs.map((paragraph, i) => {
    const ts = tokens[i];
    let score = 0;
    for (const w of wanted) {
      const tf = ts.filter(t => t === w).length;
      if (tf) {
        const df = dfs.get(w);
        const idf = Math.log(1 + (tokens.length - df + .5) / (df + .5));
        score += idf * tf * 2.2 / (tf + 1.2 * (.25 + .75 * ts.length / Math.max(1, average)));
      }
    }
    return { score, paragraph };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score ||
    (a.paragraph.paragraph_id < b.paragraph.paragraph_id ? -1 : a.paragraph.paragraph_id > b.paragraph.paragraph_id ? 1 : 0));
}

export function validateCorpus(data) {
  if (data?.schema_version !== 1 || data.data_kind !== 'collected_source' ||
      !Array.isArray(data.games) || !Array.isArray(data.documents) || !Array.isArray(data.paragraphs) || !data.audit) {
    throw new Error('지원하지 않는 수집 데이터 형식입니다.');
  }
  const docs = new Map();
  for (const d of data.documents) {
    if (!d.document_id || docs.has(d.document_id) || d.data_kind !== 'collected_source' || !/^https:\/\//.test(d.url)) throw new Error('문서 출처 정보가 올바르지 않습니다.');
    docs.set(d.document_id, d);
  }
  const ids = new Set();
  for (const p of data.paragraphs) {
    const d = docs.get(p.document_id);
    if (!d || d.game_id !== p.game_id || ids.has(p.paragraph_id) || typeof p.title !== 'string' || typeof p.text !== 'string' || !p.text_sha256) throw new Error('문단 데이터 또는 문서 연결이 올바르지 않습니다.');
    ids.add(p.paragraph_id);
  }
  return data;
}
