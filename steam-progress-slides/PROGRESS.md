# 게임 특징 추출 실험 · 개발 진행 발표

기존 발표의 어두운 Steam 색상, 사이드 목차, 카드, 이동 컨트롤을 재사용한 8장 한국어 웹슬라이드입니다. 기존 6장 React 발표는 수정 없이 `/`에 유지하고, 새 발표를 `public/progress/`, 실제 데모 사본을 `public/demo/`에 분리했습니다. 원본 `C:\gamer_recommend`는 변경하지 않았습니다.

## 발표와 데모 주소

- 발표: <https://hakyeoung.github.io/steam-recommender-progress/progress/>
- 실험에서 발견한 문제: <https://hakyeoung.github.io/steam-recommender-progress/progress/#slide-7>
- 독립 데모: <https://hakyeoung.github.io/steam-recommender-progress/demo/>
- 이전 발표: <https://hakyeoung.github.io/steam-recommender-progress/>

새 URL은 이번 커밋의 기존 Pages 워크플로 배포가 성공하면 제공됩니다. 배포 실행·검증 결과는 채팅의 완료 보고를 확인하세요.

## 실행

Node.js 22.12 이상. 저장소 루트에서:

```powershell
cd steam-progress-slides
npm.cmd ci
npm.cmd run dev
```

발표 <http://localhost:5173/progress/>, 데모 <http://localhost:5173/demo/>. macOS/Linux에서는 `npm`을 사용합니다.

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:browser
npm.cmd run preview -- --host 127.0.0.1
```

빌드 결과 미리보기: <http://localhost:4173/progress/>. 또는 빌드 후 `python -m http.server 8080 --bind 127.0.0.1 --directory dist`로 서비스하고 <http://localhost:8080/progress/>를 엽니다. `file://`로 직접 열지 마세요.

## 발표 조작

- 좌우 방향키 / PageUp·PageDown / 하단 이동 버튼 / 목차
- Home·End: 첫 장·마지막 장
- F 또는 전체화면 버튼: 브라우저 전체화면
- N 또는 발표 메모: 슬라이드별 설명·근거 확인
- `#slide-1`~`#slide-8`: 개별 슬라이드 링크
- 7장: 자료 확보·검색의 한계와 기존 B 입력의 근거 포함 결과

데스크톱은 1600×900 기준의 16:9 전체 화면을 비율 유지 축소합니다. 850px 이하에서는 읽기·조작이 가능한 세로 스크롤 화면으로 전환합니다. iframe과 시연 전용 UI·스타일·로딩 코드는 제거했습니다. 기존 검색 데모 소스와 데이터는 독립 URL에 보존하며 발표에서 자동으로 로드하지 않습니다.

## 내용과 실험 범위

실제 학습 코드의 긍정 리뷰와 실제 계정의 플레이 게임 이진 입력을 구별했습니다. 친구 테스트는 사용자 제공 정성 관찰입니다. 게임 쌍은 분석 동기이며 추출 완료 결과가 아닙니다. 자료 소스 A/B/C와 후속 DIRECT/RETRIEVED 실험을 혼동하지 않습니다.

Isaac 78·15·5/17, Hades 42·17·4/19는 quality-004 기록입니다. 5/17·4/19는 확인 근거의 기존 B 입력 포함 수이며 전체 검색 재현율이 아닙니다. 33개는 기존 dry-run/Mock 테스트 기록입니다. 이번 발표 코드의 테스트 수와 구분했습니다. 실제 OpenAI 호출은 0회이며 실제 LLM 추출·A/B/C 비교·재정렬 효과는 미검증으로 명시했습니다.

각 슬라이드의 [내용 근거](public/progress/sources.md)와 [데모 원본·배포 파일 해시](public/progress/demo-manifest.json)를 제공합니다. 데모의 원본 검색 코드·코퍼스는 그대로이며 발표 복귀 링크와 미포함 보고서 참조만 조정했습니다. 발표/데모 모두 API 키·백엔드·외부 CDN 의존성이 없습니다. 외부 원문 사이트를 열 때만 인터넷이 필요하고, 저장된 원문은 오프라인 정적 서버에서도 열립니다.

## 검증 결과

2026-10-23 로컬 실행:

- 기존 Vite 프로덕션 빌드 성공. 기존 발표 자산 파일명 유지
- 실제 코퍼스 검색 회귀 테스트 **58개 통과**, Python 순위·점수 52조합 포함
- Chrome 브라우저 점검 **21개 통과**: 보존된 독립 데모의 검색·원문·SHA-256, 7장의 실험 문제와 수치 범위, iframe 제거, 키보드, 메모, 전체화면, 8장 16:9 배치, 390px 반응형·텍스트 넘침, 로딩 실패 처리
- [브라우저 결과 JSON](tests/artifacts/browser-results.json), [7장 화면](tests/artifacts/slide-7.png)
- 정적 링크·배포 파일 무결성 검사는 `npm test`에서 함께 수행

브라우저 테스트는 `/steam-project/`라는 저장소 하위 경로를 모사하여 `dist/`를 서비스합니다. 독립 데모 보존 및 8장 발표를 각각 확인합니다. 모바일 7장은 스크롤 하단의 표·수치 해석까지 확인합니다. 원본 실험 테스트를 새로 실행하거나 LLM을 호출하지 않았습니다. 외부 출처 서버의 현재 가용성은 검증 범위 밖입니다.

## 배포

기존 `.github/workflows/deploy.yml`을 재사용합니다. 배포 출력은 계속 `steam-progress-slides/dist` 하나입니다. 새 Pages 사이트·브랜치·중복 워크플로는 생성하지 않습니다. 기존 발표 주소와 `#slide-1`~`#slide-8` 링크를 유지합니다.

```powershell
git add README.md .github/workflows/deploy.yml steam-progress-slides
git commit -m "Add feature extraction progress presentation and live demo"
git push origin main
```

GitHub Settings → Pages → Source는 기존과 동일한 **GitHub Actions**여야 합니다. Actions의 **Deploy Steam slides to GitHub Pages** 성공 후 위 URL을 사용합니다. 설정 전에 실패한 실행은 Actions → Run workflow에서 재실행합니다. 배포에 별도 비밀 환경변수가 필요하지 않습니다.

## 추가·변경 파일

- `public/progress/`: 8장 HTML, 조작 JS, 기존 스타일 사본, 새 레이아웃 CSS, 내용 근거와 해시 기록
- `public/demo/`: 기존 실험 정적 데모와 실제 데이터·감사 자료 사본
- `tests/`: 검색/정적 파일 검사, Chrome 검사, 화면과 실행 결과
- `package.json`: 테스트 명령
- `.github/workflows/deploy.yml`: 배포 전 정적 검사
- `README.md`, `PROGRESS.md`: 진입점·실행·배포 안내
