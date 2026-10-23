# 자료 품질·검색 검증 결과

2026-10-23. 실제 OpenAI API 호출 0회. 기존 추천 코드·추천 결과·웹 기능은 변경하지 않았다.

현재 B/C 자료는 게임 전체의 효과 유지·누적·교체 구조를 비교하기에 부족하다. Isaac에는 일반 결합을 설명하는 개발자 글과 한정 효과군 규칙이 있지만, Hades의 일반 은혜 획득·핵심 슬롯 교체 규칙은 이번 공지 자료에서 충분히 확보하지 못했다. 검색도 중요한 문단을 놓친다. 유료 추출은 보류한다.

## 1. 실제 확보 자료의 관련성

| 게임 | 저장된 공지 | 본문 중복 제거 | 관련 설명을 확인한 공지 | 관련 본문 중복 제거 | 확인한 근거 조각 / 문단 |
|---|---:|---:|---:|---:|---:|
| Isaac | 78 | 72 | 15 | 14 | 20 / 17 |
| Hades | 42 | 42 | 17 | 17 | 20 / 19 |

여기서 관련 설명은 **효과의 적용 대상·결합 결과·유지/제거·교체·제공 제약 중 하나를 실제로 설명한 문장**이다. 단순 출시·판매·공연·굿즈·업데이트 일정, 독립적인 피해량 상향, “시너지 버그 수정”만 적힌 항목은 근거로 세지 않았다. 패치라도 특정 조합의 적용 조건과 결과를 명시하면 그 문장만 포함했다. 예를 들어 Icy Flare가 Winter Harvest의 선행 조건이라는 수정은 해당 연결 하나의 근거이며 전체 선행 조건 목록의 근거가 아니다.

이는 에이전트의 1차 문서 점검이다. 120건의 제목과 넓은 규칙 키워드의 문장 구간을 선별하고, 긍정 근거와 검색 상위 문단을 문맥에서 확인했다. **독립적인 사람의 전수 정답 검증은 아니다.** 미포함 문서는 이번 점검에서 적합한 근거를 확인하지 못했다는 뜻이며, 관련 내용이 절대 없다고 확정하지 않는다. 관련 문서 수도 이 방식으로 확인한 보수적인 수치다.

전체 120건의 판정·중복·URL·게시/수집 시점은 [official_inventory.csv](audit/official_inventory.csv), 40개 근거 조각의 원문·해석·위치·출처는 [evidence.md](audit/evidence.md) 및 [evidence.json](audit/evidence.json)에 있다. 각 근거는 원문 존재 검사를 통과해야 생성된다. 검토 메모는 LLM 프롬프트와 사람 정답 파일에 들어가지 않는다.

| 대표 자료 | 실제 확인 내용 | 범위·제약 |
|---|---|---|
| Isaac, [COMBO BREAKER!](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/4050393736342917497), `d-d96564ad35c78cf12c9fb419:p0000` | Rebirth에서 기존 눈물 효과와 특수 공격의 결합을 지원하려 한 설계, 유도 Brimstone·다중 Mom's Knife 사례 | OG 설명과 Rebirth 설명, Repentance 확장 설명이 한 문단에 함께 있음. 모든 아이템의 무제한 결합이나 실제 발생 빈도의 근거는 아님 |
| Isaac, [We wisp you a merry Christmas!](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/3917534300078707164), `d-da3b743b0dd4866d6c1774f4:p0000–p0001` | Book of Virtues와 일반 액티브 획득 시 결합, 액티브 교체 중 책 유지, 일회용 소모 후 책 상태 복귀, 액티브에 따른 위습 효과 | 특정 효과군의 규칙. Repentance 출시 전 개발 글이며 변경 가능성 명시 |
| Isaac, Internal Item Descriptions, `d-55c29d161515969ec05c176b:p0002` | 서로 다른 보호막의 누적 및 Wooden Cross → Blanket → Holy Mantle → Holy Card 우선순위 | 보호막 효과군에 한정. 본문의 다른 효과군으로 확대 불가 |
| Isaac, Update v1.7.5, `d-f060c69512770fa83c6763e4:p0004` | 20/20과 Inner Eye/Mutant Spider 동시 보유 시 추가 발사 대신 발사 속도 감소 상쇄, 추가 20/20 복사본의 별도 규칙 | 단순 효과 합산의 반례. 확장판의 당시 규칙 |
| Hades, Early Access Patch 045, `d-52f7f5dd188fcce5edc9dbe8:p0000` | Dashing Flight와 Charged Flight는 서로 보유 시 제공되지 않음 | 해머 두 개의 구체적 제공 제한. 은혜 슬롯 교체 규칙과 별개 |
| Hades, v1.0 Launch Update, `d-5f934a20684631f86db898a3:p0003` | Dash Nova의 특수 공격 중 돌진·Sturdy, Quake Cutter에 은혜 효과 적용 | 해머의 행동 변화와 추가 효과 연결. 현재 전체 호환표는 없음 |
| Hades, [Blood Price Update](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/3384966595888900267), `d-a9550ddd1968393f4458ce4b:p0006` | Anvil of Fates가 무작위 해머 하나를 제거한 뒤 둘을 제공 | 모루 전용 규칙. 핵심 은혜 교환으로 해석하면 오류 |
| Hades, 같은 자료 `p0003–p0004` | Rush Delivery의 추가 이동 속도→피해 연결, Kinetic Launcher의 원거리 충전 공격화 | 명명된 세트 보너스 이외의 연결을 조사할 실마리. 필요 선행 조건·현행 상태는 별도 확인 필요 |

관련 공지 수가 효과군 커버리지는 아니다. Hades의 관련 문서 상당수는 특정 해머·제공 조건·예외를 다룬다. Mirror 재능 쌍의 동시 활성 제한은 확보했지만 런 중 핵심 은혜 슬롯에 대한 근거로 전용할 수 없다.

기존 메타데이터의 `game_version`, `dlc`, `mode`에는 unknown이 많다. 제목·본문에 보이는 범위와 게시 시점은 보존했지만 현재 버전으로 자동 승격하지 않았다. 특히 World Smasher는 초기 공지에서 행동 교체를 설명하고 Blood Price 공지에서는 삭제를 알린다. 이를 현행 공존 효과나 같은 버전의 conflict로 처리하면 안 된다. Isaac의 공통 결합 원칙은 유지하되 개별 예외·우선순위가 확장판마다 같다고 가정하지 않는다.

## 2. 기존 검색의 실제 결과

기존 `rank`와 `select`, 기본 4개 쿼리를 변경하지 않고 실행했다. 일반 획득과 공격 변화는 같은 `rank`에 중립적인 추가 쿼리 2개를 넣어 별도 점검했다. 공식 자료만 검색한 결과와 기존 search CLI처럼 모든 자료를 검색한 결과를 구분했다. 리뷰에서 나온 문단은 자동으로 시스템 근거로 인정하지 않는다.

원문 전체가 포함된 [search_top3.csv](audit/search_top3.csv)에 두 게임 × 6개 쿼리 × 2개 검색 범위 × 상위 3개 = **72개 결과**가 있다. URL, `normalized.md` 행, 문단 순서, 원본 파일 경로, 문맥 판정도 포함한다. 아래는 공식 자료 검색 결과다. 판정은 에이전트 점검이며 검색 정확도의 사람 평가 점수는 아니다.

| 게임·질의 | 1위 → 2위 → 3위 문단 | 판단 |
|---|---|---|
| Isaac 유지·교체 | COMBO BREAKER `p0000` → v1.7.1 `p0000` → Internal Item Descriptions `p0005` | 1위는 버전별 결합 원칙 일부, 2위는 기부함 교체 등 무관, 3위는 저장/종료 버그 수정으로 획득 일반칙에 부족 |
| Isaac 누적·동시 적용 | Jan 6 2017 `p0000` → 같은 본문 중복 `p0000` → v1.9.7.8 `p0002` | 세 결과 모두 필요한 누적 규칙의 근거로 부적합. Lua 로딩·모드 API·HUD 메시지 stack이 원인 |
| Isaac 효과 간 상호작용 | v1.7.9 `p0001` → v1.7.5 `p0003` → Afterbirth+ v1.06.0211 `p0001` | 복제 소환체·발동 상한·피해 보정 등 특정 사례는 판단 가능. 일반 결합 구조의 완전한 설명은 아님 |
| Isaac 일반 획득 중 결합 | v1.9.7.11 `p0002` → MODS BACK `p0001` → v1.9.7.11 `p0004` | 재추첨 예외·모드 속성·버그 수정. 일반 획득 시 결합을 설명하기 부족 |
| Isaac 공격 방식 변화 | COMBO BREAKER `p0000` → MODS BACK `p0003` → v1.7.5 `p0003` | 1·3위는 한정 사례 확인 가능. 2위는 Lua TearFlags API 설명 |
| Hades 유지·교체 | July 2021 `p0000` → Nighty Night `p0008` → Dive Into Blood Price `p0001` | 패치 노트 메뉴 제거·설정/재화·기술 홍보로 세 결과 모두 부적합 |
| Hades 누적·동시 적용 | Early Access 041 `p0001` → Oct 2 `p0001` → Early Access 038 `p0001` | 동시 대사 멈춤·소리 중첩·불특정 비호환 수정. 효과 누적 규칙이나 구체적 호환표 판단 불가 |
| Hades 효과 간 상호작용 | Oct 13 `p0000` → Early Access 039 `p0001` → Blood Price `p0002` | 1위의 제공 선행 조건을 전투 효과 결합으로 보면 오류. 2위 무관. 3위는 Cast 변형 등 특정 사례 가능 |
| Hades 일반 획득 중 결합 | Nighty Night `p0003` → March 2021 `p0000` → Dec 1 `p0000` | Mirror·개별 제공 조건·효과 수정. 일반 은혜 획득 후 누적/교환 규칙에 부족 |
| Hades 공격 방식 변화 | Early Access 047 `p0000` → Blood Price `p0002` → Blood Price `p0004` | 유도 Cast·주변 파동·원거리 충전 등 개별 변화 확인 가능. 선행 조건과 현행 여부는 추가 확인 |

효과군 질의 상위 3개도 CSV에 있다. 예를 들어 Isaac의 Book of Virtues 글이 효과군 3위로 발견되지만, 일반 획득 질의에서는 4위, 유지·교체 질의에서는 90위다. 단일 질의 순위와 최종 B 입력 포함 여부를 구분해야 한다.

### 자료가 있는데 놓치는 경우

| 근거 | 관련 질의 순위 | 기존 B 입력 |
|---|---|---|
| Isaac 보호막 누적·우선순위 `d-55c29d161515969ec05c176b:p0002` | 누적 10위 | 미포함 |
| Isaac 복제 소환체에 Technology 2 적용 `d-8bebc48cf9af62e44401c8e8:p0000` | 효과군 20위, 상호작용 59위 | 미포함 |
| Isaac 액티브 충전 우선순위·재추첨 유지 `d-ccb0d07d03ac75bea9008c21:p0002` | 효과군 8위, 누적 28위 | 미포함 |
| Hades 해머 두 개의 상호 배타성 `d-52f7f5dd188fcce5edc9dbe8:p0000` | 세부 순위는 retrieval_ranks.json 참조 | 미포함 |
| Hades 추가 이동 속도→피해 `d-a9550ddd1968393f4458ce4b:p0003` | 상호작용 44위, 효과군 58위 | 미포함 |

확인한 근거 문단 중 B에 들어간 것은 Isaac **5/17**, Hades **4/19**다. 중복 공지의 문단도 이 분모에는 남으므로 독립 근거 수와 다르다. 이 수치는 **선정한 근거 집합에 대한 입력 포함 비율**이며 전체 문서의 재현율이나 추출 정확도가 아니다. [retrieval_ranks.json](audit/retrieval_ranks.json)에 40개 조각의 질의별 순위와 최종 포함 여부가 있다.

### 문서가 부족한 경우

- Hades: 핵심 은혜 슬롯의 전체 목록, 같은 슬롯 제안 시 기존 효과의 처리, 비핵심 은혜의 유지·중복·상호 배타 규칙. Exchange 제공율 변경 공지만으로 교환 구조를 채울 수 없다.
- Isaac: 패시브·액티브·장신구의 일반 획득/교체 구조와 전체 공격 변형 우선순위 표. 특정 책·보호막·발사 아이템 사례로 전체를 채울 수 없다.
- 두 게임: 일상적 플레이에서 해당 상호작용을 경험하는 실제 빈도와 분포. 문서 사례의 존재로 판단 불가.
- 공격 예시가 영상/이미지로만 제시된 부분: 현재 텍스트 원문에는 시연 행동 자체가 없다.

수집/검색 오류를 구분하면 위키 부재와 외부 링크만 있는 공지는 수집 단계, 저장된 유효 문단 누락은 검색 단계다. 정규화는 2,400자 경계에서 문장을 자르거나 직전 제목을 다음 문단에서 잃을 수 있다. 예를 들어 Mirror 제목이 빠진 문단을 은혜 일반 규칙으로 읽는 위험이 있다. 원문 JSON의 `$.contents` 위치와 정규화 위치를 함께 내보내 추적 가능하게 했다. LLM 미실행으로 해석 오류율은 아직 측정하지 않았다.

## 3. 위키 확보 대안과 실제 상태

이번 점검에서 새로 확보해 코퍼스에 넣은 위키 게임 문서는 **0건**이다. 검색 미리보기는 정책·자료 발견에만 사용했고, 차단된 원문을 대신하는 수집 문서로 넣지 않았다. 프록시·미러·다른 API 주소로 차단을 우회하지 않았다.

| 방법 | 확인 결과 | 현실적인 다음 단계 |
|---|---|---|
| wiki.gg API | [운영 지원 문서](https://support.wiki.gg/wiki/New_Wiki)는 API 편집 도구를 허용하지만 자동 도구 사용 목적을 위키 개선/모니터링으로 한정함. 현재 연구용 수집의 허가는 확인되지 않음 | Isaac 핵심 3~4개 문서의 연구용 텍스트 제공·내보내기 허용 범위를 운영자에게 확인해야 함. 요청 메시지는 발송하지 않음 |
| wiki.gg 공식 덤프 | 이번 두 게임에 대해 운영자가 제공하는 사용 가능한 덤프를 확인하지 못함 | 존재한다고 가정하거나 자체 API 스크래핑으로 대체하지 않음 |
| Fandom 공식 덤프 | [공식 도움말](https://community.fandom.com/wiki/Help:Database_download)에 Special:Statistics의 현재 문서/이력 포함 XML 다운로드 절차가 있음. 라이선스는 각 위키 조건을 따름 | Hades의 실제 덤프 제공 여부·날짜·사이트 이용 조건은 미확인. 해당 경로의 자동 접근이 차단되어 중단함. 일반 브라우저에서 제공되는 정식 다운로드를 확인하는 경로가 후보 |
| 소수 페이지 수동 내보내기 | [공식 도움말](https://community.fandom.com/wiki/Help:Importing_and_exporting_pages)은 Special:Export로 지정한 문서의 XML과 이력을 내보내는 기능을 설명함 | 정상 접근과 라이선스·외부 API 전송 허용 범위가 확인된 문서만 사용. 템플릿·확장 아이콘·작성자 귀속을 함께 보존 |
| 대체 전문 자료 | [Platinum God](https://tboi.com/)은 관련 아이템 설명이 풍부하나 이번 점검에서 자동 수집·재이용 허가를 확인하지 못함. [HadesModding](https://github.com/micriley/HadesModding), [hades_json_data](https://github.com/genie137/hades_json_data)는 관련 자료가 있으나 확인한 저장소 화면에서 명시적 LICENSE를 찾지 못함 | 공개 열람 가능 여부만으로 수집 허용을 확정하지 않음. 권리 범위 확인 전 추가 코퍼스 편입 보류. 모드 로더 MIT 라이선스를 게임 데이터에 전용하지 않음 |

wiki.gg 원문 403, Fandom 도움말/약관 원문 일부 402·robots 차단을 만났다. 공식 검색 색인으로 확인한 도움말 내용과 원문 접근 실패를 구분했다. 플랫폼의 내보내기 기능 존재는 이번 연구와 LLM 전송까지 무조건 허용한다는 뜻이 아니다. 최신 약관 본문을 끝까지 확인하지 못한 부분은 미확인으로 남겼다.

가장 작은 확보 대상은 Isaac의 Items/패시브·액티브 분류/눈물 효과 적용 규칙, Hades의 Boons/교환 및 핵심·추가 효과 분류/Daedalus Hammer다. 유명 조합 페이지보다 이 문서들이 먼저 필요하다. 판본·이력·라이선스·작성자 귀속과 함께 허용된 방식으로 소수 문서를 확보하는 것이 우선이다.

기존 `import-doc --file ... --metadata ...` 경로는 텍스트/HTML을 받는다. `permission_confirmed`, 실제 수집 시점, URL, 라이선스, 접근 근거를 요구하며 외부 LLM 전송 허용도 별도 기록한다. **MediaWiki XML/7z는 아직 직접 해석하지 않는다.** 덤프 확보 시 원본 XML/7z를 보존하고 템플릿 확장·버전 아이콘을 검증한 뒤 텍스트/HTML과 메타데이터로 입력해야 한다. XML 태그만 제거하면 조건 정보가 사라질 수 있다.

## 4. 1게임·1조건 호출 준비: 계획만 생성

readiness-001/dry_run.json (`runs/readiness-001/dry_run.json`; ? ???? ??)은 Isaac/B 한 작업만 동결한 계획이다. B는 `partial_missing_wiki`이며 quality_gate.json (`runs/readiness-001/quality_gate.json`; ? ???? ??)에 자료·검색 품질 보류를 기록했다. 예산 검사 통과와 자료 품질 통과는 별개다. 실제 호출·재시도·추출 결과 생성은 수행하지 않았다.

| 항목 | 값 |
|---|---:|
| 모델 | gpt-4.1-mini |
| 계획 호출 수 / 누적 유료 시도 상한 | 1 / 1 |
| 현재 선택 문단 | 15 |
| 예상 입력 토큰, 프롬프트·스키마·메타데이터 포함 | 11,754 |
| 출력 토큰 상한 | 3,000 |
| 입력 계획 여유분, 20% + 512 | 14,617 |
| 입력 계획 상한 | 16,000 / 호출 |
| 단가, USD/백만 토큰 | 입력 0.40 / 출력 1.60 |
| 출력 상한까지 사용 시 예상 비용 | **$0.0095016** |
| 입력 여유분 포함 예산 추정 | **$0.0106468** |
| 실행 전 추정 비용 제한 | **$0.02 / 이 run** |
| 실제 API 사용 비용 | **$0** |

단가는 2026-10-23 확인한 [OpenAI 공식 모델 문서](https://developers.openai.com/api/docs/models/gpt-4.1-mini)의 일반 텍스트 요금이다. 캐시 할인·Batch 할인은 적용하지 않았다. 계산은 `(11,754 × 0.40 + 3,000 × 1.60) / 1,000,000`이다. 실제 입력 과금 토큰과 가격 변화까지 보장하는 청구 최대액은 아니며 로컬 계획 추정치다. 출력 3,000은 API 요청의 실제 상한이다.

출력 6,000은 기존의 최대 6개 효과군+8개 사례를 넉넉히 담으려는 설정이었으며 실측 근거가 없었다. 같은 입력에서 6,000을 모두 쓰면 $0.0143016으로 예상된다. 이번 소형 점검은 3,000으로 낮췄다. 가상 게임의 5개 레코드·10개 원자 사실·3개 unknown을 같은 JSON 구조로 인코딩했을 때 1,237토큰이었다(크기 점검 (`runs/readiness-001/output_size_check.json`; ? ???? ??), 재현 스크립트 (`tools/measure_output_size.py`; ? ???? ??)). **실제 모델이 3,000 안에 필요한 내용을 모두 출력한다는 검증은 아니다.** 긴 인용·한글 설명·전체 14개 레코드는 상한에 걸릴 수 있다. `incomplete`는 성공으로 처리하지 않으며 자동 재시도하지 않는다. 데이터 소스 비교 시에는 동일 출력 상한과 지침을 모든 조건에 적용해야 한다.

호출 횟수·입력 계획치·추정 비용은 네트워크 전 검사한다. 키가 있어도 제한 초과 시 전송하지 않는다. 실행 잠금으로 같은 run의 동시 전송을 막고, 전송 전 유료 시도를 예약해 타임아웃·프로세스 중단 후 무심코 재호출하지 않게 했다. 제한은 run별이며 다른 run/프로젝트 전체의 과금을 통제하지 않는다. 확인하지 못한 가격을 0으로 간주하지 않는다.

## 5. 재현과 다음 작업

저장된 코퍼스를 대상으로 새 경로에 점검 산출물을 만든다. 외부 요청이나 LLM 호출이 없다.

```powershell
.\feature-extraction-experiment\.venv\Scripts\python.exe feature-extraction-experiment/pilot.py audit-quality --output feature-extraction-experiment/runs/quality-new
```

기존 원문과 기존 동결 실행은 수정하지 않았다. 코퍼스 해시·검토 설정 해시·문단 ID·원본 경로를 산출물에 보존했다. `runs/quality-004`가 이번 최종 점검이며 `quality-001`은 이전 산출물로 보존했다.

호출 준비 옵션은 다음과 같으며 아래 명령도 준비·dry-run만 수행한다. 단가는 해당 날짜의 확인 값을 사용한 예다. 모델 변경 시 가격도 다시 확인해야 한다.

```powershell
$env:PILOT_INPUT_USD_PER_MILLION='0.40'
$env:PILOT_OUTPUT_USD_PER_MILLION='1.60'
.\feature-extraction-experiment\.venv\Scripts\python.exe feature-extraction-experiment/pilot.py prepare --run feature-extraction-experiment/runs/readiness-new --game 250900 --condition B --max-output-tokens 3000 --max-calls 1 --max-input-tokens 16000 --max-cost-usd 0.02
.\feature-extraction-experiment\.venv\Scripts\python.exe feature-extraction-experiment/pilot.py extract --run feature-extraction-experiment/runs/readiness-new --dry-run
```

다음 우선순위는 핵심 문서의 합법적인 확보, 제목/문장 경계를 보존한 문단 분할과 모딩·UI 잡음 처리, 이번 검토 근거를 분리해 둔 검색 검증이다. 검토용 정답 문구를 추출 프롬프트에 넣거나 관련 사례만 몰래 B에 추가해서 성능 향상으로 보고하지 않는다. 검색을 변경하면 별도 버전으로 동결하고 같은 A/B/C 실험에 공통 적용한다.

현재까지는 수집·검색 점검이며 LLM 추출 정확도, 사람 정답 대비 정확도, 추천 성능 향상은 측정하지 않았다. 추가된 제한·출처 위치·실행 분리 검사를 포함한 로컬 테스트 33개가 통과했다. provider 테스트는 가상 키와 mock만 사용했다.
