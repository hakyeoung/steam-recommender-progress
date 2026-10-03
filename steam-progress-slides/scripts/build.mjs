import { existsSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');

// 일부 Windows/Node 환경에서 recursive rm이 중단되어 일반 파일 삭제로 정리합니다.
// 이 프로젝트의 dist만 대상으로 하며, 심볼릭 링크는 따라가지 않습니다.
function emptyDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      emptyDirectory(entryPath);
      rmdirSync(entryPath);
    } else {
      unlinkSync(entryPath);
    }
  }
}

if (outputDirectory !== join(projectRoot, 'dist')) throw new Error('Unexpected build output path');
if (existsSync(outputDirectory)) emptyDirectory(outputDirectory);
await build({ root: projectRoot, build: { outDir: outputDirectory, emptyOutDir: false } });
