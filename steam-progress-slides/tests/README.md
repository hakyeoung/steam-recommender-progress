# 브라우저 검증

`node --test tests/search.test.mjs`는 실제 JSON에서 JavaScript 검색 결과와 Python으로 미리 계산한 순위·점수를 비교합니다.

`npm run build` 후 `node tests/browser.mjs`로 설치된 Chrome에서 검사합니다. 필요하면 `CHROME_PATH` 환경변수를 지정합니다. 추가 패키지는 없습니다. Node 22.12 이상이 필요합니다.

검사는 `/steam-project/` 저장소 하위 경로를 모사한 임시 HTTP 서버를 사용합니다. 실제 검색·게임 전환·원문과 출처·문단 해시·누락/오탐·버전 혼합·iframe·전체화면·키보드·8장 데스크톱/모바일·잘못된 데이터 오류 처리를 확인합니다. 결과와 스크린샷은 `artifacts/`에 저장합니다.

출처 페이지를 외부 서버에서 새로 수집하거나 실제 LLM API를 호출하지 않습니다. 원문 링크의 형식과 저장된 원문 무결성을 검증하며 외부 사이트의 현재 가용성을 보장하지 않습니다.
