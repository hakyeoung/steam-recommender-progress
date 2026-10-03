import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 상대 경로로 빌드하므로 repo 이름이나 GitHub Pages 하위 경로를 바꿔도 동작합니다.
  base: './',
});
