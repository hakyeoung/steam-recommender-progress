# steam-recommender-progress

Steam API 기반 개인 프로젝트의 9월 진행상황과 10월 계획을 담은 6장 웹 슬라이드입니다.

React + Vite 앱은 [`steam-progress-slides/`](./steam-progress-slides/) 폴더에 분리되어 있습니다. [실행 및 GitHub Pages 배포 안내](./steam-progress-slides/README.md)를 확인하세요.

```sh
cd steam-progress-slides
npm ci
npm run dev
```

빌드는 같은 폴더에서 `npm run build`로 실행합니다. 저장소 루트에서 `git push origin main`한 뒤 GitHub의 **Settings → Pages → Source → GitHub Actions**를 선택하세요. 설정 전에 첫 실행이 실패했다면 Actions 탭의 **Deploy Steam slides to GitHub Pages → Run workflow**로 다시 실행합니다. 이후 push마다 자동 배포됩니다.

배포 성공 후 제출할 URL: **https://hakyeoung.github.io/steam-recommender-progress/**
