# Steam Recommender · 월간 진행 보고

Steam API 기반 개인 게임 추천 프로젝트의 **9월 진행상황과 10월 계획**을 담은 6장 웹 슬라이드입니다. React + Vite로 만들었으며 GitHub Pages에서 정적 사이트로 배포합니다.

## 로컬 실행

Node.js 22.12 이상을 사용하세요. GitHub Actions에서는 Node.js 24를 사용합니다.

저장소 루트에서:

```sh
cd steam-progress-slides
npm ci
npm run dev
```

브라우저에서 터미널에 표시되는 주소를 여세요. 기본 주소는 `http://localhost:5173`입니다.

프로덕션 빌드와 미리보기:

```sh
npm run build
npm run preview
```

빌드 결과는 `steam-progress-slides/dist/`에 생성됩니다. 미리보기 기본 주소는 `http://localhost:4173`입니다.

`npm run build`는 `scripts/build.mjs`에서 이전 빌드 결과를 정리하고 Vite 빌드를 실행합니다. 일부 Windows/Node 환경에서 재귀 삭제가 중단되는 문제를 피하도록 일반 파일 삭제를 사용하며, 매번 `dist/`만 정리하므로 오래된 자산이 배포에 섞이지 않습니다.

## GitHub Pages 배포 — push 후 필요한 설정

배포는 **GitHub Actions** 한 가지 방식으로 구성했습니다. 별도 `gh-pages` 브랜치, 추가 배포 패키지, 개인 토큰이 필요하지 않습니다.

1. 저장소 루트에서 커밋을 `main` 브랜치에 push합니다.

   ```sh
   git push origin main
   ```

2. GitHub 저장소에서 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
3. **Actions** 탭에서 **Deploy Steam slides to GitHub Pages**를 선택합니다. 첫 push가 Pages 설정 전에 실패했다면 **Run workflow → main → Run workflow**로 다시 실행합니다.
4. 실행이 성공하면 **Settings → Pages → Visit site** 또는 Actions 실행의 `github-pages` 환경 링크를 엽니다.
5. 여섯 슬라이드와 이동 버튼을 확인하고 **웹사이트 URL 하나만 과제로 제출**합니다.

현재 저장소(`hakyeoung/steam-recommender-progress`) 기준 예상 제출 URL:

```text
https://hakyeoung.github.io/steam-recommender-progress/
```

위 주소는 배포가 성공한 뒤 사용할 수 있습니다. 발표자료를 한 장씩 보려면 `#slide-1`부터 `#slide-6`까지 해시를 붙일 수 있으며, 과제 제출에는 기본 URL을 사용하면 됩니다. 소스 코드 저장소 주소나 Actions 실행 주소를 제출하지 마세요.

GitHub Free에서는 공개 저장소를 사용하세요. 저장소의 Actions가 비활성화되어 있다면 **Settings → Actions → General**에서 이 워크플로의 공식 `actions/*` 사용을 허용합니다. 이후 `main`에 push할 때마다 자동으로 다시 빌드하고 배포합니다. 기본 브랜치가 `main`이 아니라면 루트 `.github/workflows/deploy.yml`의 `branches: [main]`을 해당 브랜치명으로 수정하세요.

Vite의 `base: './'`와 해시 기반 슬라이드 이동을 사용하므로 저장소 이름을 바꾸거나 하위 경로로 배포해도 자산 경로가 유지됩니다. API 키나 환경변수 설정은 필요하지 않습니다.

배포 설정 참고: [Vite 공식 배포 안내](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages 공식 워크플로 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 프로젝트 구조

```text
repository/
├── README.md                        # 프로젝트 및 배포 안내 링크
├── .github/workflows/deploy.yml      # GitHub는 저장소 루트에서 workflow를 읽음
└── steam-progress-slides/            # 기존 프로젝트와 분리된 웹 슬라이드 앱
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── index.html
    ├── public/favicon.svg
    ├── scripts/build.mjs             # 기존 dist 정리 후 Vite 빌드
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                  # 해시/키보드/버튼 이동
    │   ├── slides.jsx               # 발표 내용과 개념도
    │   └── styles.css               # 반응형 Steam 스타일
    └── README.md
```

새 저장소로 사용하려면 `steam-progress-slides/` 폴더와 루트 `.github/` 폴더를 새 저장소 루트에 **현재 구조 그대로** 복사하세요. 그 저장소에서 `git init -b main`, `git add .`, `git commit -m "Add Steam progress web slides"` 후 새 GitHub 저장소를 origin으로 연결하고 push하면 됩니다. 새 저장소의 제출 URL은 `https://<사용자명>.github.io/<저장소명>/`입니다.

## 발표 내용과 조작

1. 프로젝트 소개: Steam 보유 게임/플레이 시간 기반 개인 추천 서비스
2. 9월 진행: Steam 계정 연동 및 데이터 수집, Steam Dataset 2025
3. 9월 진행: Popularity, User-KNN, ALS, BPR 비교; Positive review + temporal evaluation; User-KNN 후보 선정
4. 9월 진행: 5-core filtering 적용 시 실제 사용자 catalog overlap 0%; filtering 완화 후 추천 생성; 친구 계정에서 장르 취향 반영 부족 발견
5. 10월 계획: 다양한 실제 계정에 적용하고 사용자 피드백으로 검증
6. 10월 계획: genre/tag와 playtime 기반 content profile 추천 개선

- 방향키 `←` / `↑`: 이전 장, `→` / `↓`: 다음 장
- `PageUp` / `PageDown`, `Space`: 슬라이드 이동
- `Home` / `End`: 첫 장 / 마지막 장
- 왼쪽 목차, 하단 점, 이전/다음 버튼으로 직접 이동
- 모바일에서는 상단 목차를 가로로 스크롤할 수 있고, 본문이 길면 슬라이드 내부를 스크롤합니다.
- `#slide-N` 링크, 새로고침, 브라우저 뒤로/앞으로 이동을 지원합니다.

본문 내용은 `src/slides.jsx`, 제목/목차는 같은 파일의 `slides` 배열에서 수정합니다. 정량 성능 점수, 사용자 수, 수집 규모 등 제공되지 않은 수치는 추가하지 않았습니다. 커버의 게임 이미지와 프로필 막대는 CSS 개념도이며 실제 추천 결과나 측정 점수가 아닙니다.

이 프로젝트는 **진행 보고용 정적 발표자료**입니다. 실제 Steam API 요청이나 추천 모델 실행은 하지 않습니다. Google Fonts가 연결되지 않으면 시스템 글꼴을 사용하며, 외부 게임 이미지나 로그인 없이 동작합니다.

## 커밋 준비

저장소 루트에서 변경사항을 확인한 뒤, 필요한 경우 아래처럼 새 앱과 배포 설정만 커밋합니다. `node_modules/`, `dist/`, `.env`는 제외됩니다.

```sh
git status --short
git add steam-progress-slides .github/workflows/deploy.yml README.md
git commit -m "Add Steam progress slides and GitHub Pages deployment"
git push origin main
```

이미 커밋된 상태라면 바로 `git push origin main`을 실행하고 위 Pages 설정을 진행하면 됩니다.
