# 발표 근거와 검증 범위

2026-10-23 기준. 원 프로젝트 `C:\gamer_recommend`는 읽기만 수행했고 추천 알고리즘과 실험 결과는 수정하지 않았습니다.

| 슬라이드 | 근거 | 해석 범위 |
|---|---|---|
| 1 | 기존 발표자료, 사용자 제공 목표 | 프로젝트 목적 |
| 2 | recommender-experiment/src/run_real_user.py: nearest_users, recommend, binary profile; run_experiment_v2.py: load_positive, split_interactions | 긍정 리뷰로 학습, 실제 계정의 playtime_forever > 0을 이진 입력. 시간의 크기 가중 없음. 보유 게임 제외 |
| 3 | 발표 요청에 명시된 친구 테스트 사례 | 정성적 관찰. 참가자 수·만족도·정확도는 미측정 |
| 4 | 사용자 제공 분석 동기 | 게임 비교의 분석 축. 추출 완료 결과·게임 전체 규칙으로 해석하지 않음 |
| 5 | feature-extraction-experiment/README.md 데이터 소스 A/B/C 정의, PILOT_REPORT.md | A=상점, B=위키+공식, C=동일 B+리뷰. 현재 위키 미확보. 실제 LLM 비교 미완료 |
| 6 | DATA_QUALITY_REPORT.md quality-004, PILOT_REPORT.md, 데모 감사 JSON | 33개는 기존 테스트 기록. 공지 수와 근거 문단 수의 단위를 구분. 실제 API 호출 0회 |
| 7 | docs/demo 실제 정적 데이터·검색 코드 | 실제 저장 문단의 BM25. API·의미 검색·LLM 추출 화면 아님 |
| 8 | DATA_QUALITY_REPORT.md, EVIDENCE_EXPERIMENT_REPORT.md와 사용자 제공 계획 | 현재 한계와 향후 계획. 추천 재정렬과 개선 효과 미검증 |

## 함께 제공하는 실제 점검 자료

- [자료 품질 보고서](../demo/data/DATA_QUALITY_REPORT.md)
- [수집 문서·문단 JSON](../demo/data/corpus.json)
- [검토 근거 원문과 출처](../demo/data/audit/evidence.md)
- [공지 점검 목록 CSV](../demo/data/audit/official_inventory.csv)
- [검색 상위 결과 CSV](../demo/data/audit/search_top3.csv)
- [포함된 데모 파일의 SHA-256 기록](demo-manifest.json)

Isaac의 5/17과 Hades의 4/19는 quality-004에서 확인한 근거 문단 중 기존 B 입력에 포함된 개수입니다. 전체 검색 재현율·추출 정확도·추천 성능이 아닙니다. 관련 공지 15/78·17/42 역시 에이전트 1차 점검이며 사람의 독립 전수 검증이 아닙니다.

후속 evidence-003의 DIRECT/RETRIEVED 실험은 게임별 공식 문서 6개를 고정한 별도 비교입니다. 기존 전체 공지 코퍼스의 B 입력과 분모가 다르므로 이 발표 수치에 혼합하지 않았습니다. 추가 위키 확보 및 실제 LLM 추출은 여전히 미완료입니다.

기존 데모 README의 실험 전체 재실행 기록은 45개이며, 이번 실행 결과는 발표 코드의 README/검증 보고서를 따릅니다. 발표의 33개는 사용자 요청의 기존 Mock 검증 기록으로 유지합니다. 테스트 개수로 LLM 품질을 주장하지 않습니다.

데모의 원본 검색 코드와 JSON 데이터는 그대로 복사했습니다. 배포용 사본에서는 발표로 돌아가는 링크와 품질 보고서의 미포함 원 프로젝트 참조 링크만 조정했습니다. `.env`, API 키, Steam 계정 CSV, Mock 모델 출력, 원본 raw.bin은 포함하지 않습니다.
