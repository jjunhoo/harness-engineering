# 폴더·파일 목적 정의

`AGENTS.md` [3]에 따라 **저장소의 모든 주요 경로가 무엇을 위해 존재하는지**를 한곳에 정의한다. 에이전트는 구현 전 본 문서를 스캔해 작업 범위가 어느 영역에 속하는지 확인한다.

## 루트 핵심 파일 (운영 헌장·정책)

| 경로 | 목적 | `AGENTS.md` 대응 |
|------|------|------------------|
| `AGENTS.md` | AI·인간 모두의 최상위 규칙, 시스템 목표·철학 | [1][2] 및 전체 |
| `DESIGN.md` | 논리/물리 아키텍처, 컴포넌트 관계, 변경 원칙 | [3][7][10]-1 |
| `PRODUCT_SENSE.md` | 가치 우선순위·“좋은 머지” 정의 | [1] 방향성 |
| `QUALITY_SCORE.md` | 차원별 점수·하드 게이트 | [5][10]-5 |
| `RELIABILITY.md` | 관측성·SLO·실패 모드·장시간 실행 | [5][11] |
| `SECURITY.md` | 비밀·공급망·데이터·에이전트 위험 | [7][11] |

## 지식 구조 (`AGENTS.md` [3] — 지식)

| 경로 | 목적 |
|------|------|
| `docs/` | **에이전트 내비게이션 허브**. 워크플로·피드백·컨텍스트·예시 등 “어떻게 일할지”의 절차 지식. |
| `docs/INDEX.md` | 문서 그래프 진입점 (얕은 층). |
| `docs/WORKFLOW.md` | 에이전트 실행 루프(10단계)의 단일 SoT. |
| `docs/AGENT_LOOP_STEP_REFERENCE.md` | 각 단계에서 사용하는 문서·규칙·스킬·스크립트 표 + 자동 실행 방법. |
| `docs/FEEDBACK.md` | 다층 피드백·지표·도구·접근 방법 (`AGENTS.md` [5]). |
| `docs/CONTEXT.md` | 컨텍스트 분할·탐색 프로토콜 (`AGENTS.md` [9]). |
| `docs/SELF_IMPROVEMENT.md` | 실패 흡수 파이프라인 (`AGENTS.md` [8]). |
| `docs/EXAMPLE_SCENARIO.md` | end-to-end 실행 예시 (`AGENTS.md` [10]-7). |
| `docs/FOLDER_PURPOSE.md` | 본 문서 — 폴더/파일 존재 이유. |
| `docs/MULTI_AGENT_REVIEW.md` | 멀티 에이전트 리뷰 역할·순서·산출물. |
| `docs/AUTO_TEST_GENERATION.md` | 자동 테스트 생성 범위·원칙·워크플로 삽입점. |
| `docs/LOG_FEEDBACK.md` | 로그 계약·에이전트 읽기 경로·트리아지 루프. |
| `docs/AUTO_IMPROVEMENT_ON_FAILURE.md` | 실패 트리거·자동 패치 루프·가드레일. |
| `plans/` | **인간 목표 → 실행 가능한 단위**로 쪼갠 계획. 브랜치/PR 단위와 정렬. |
| `references/` | 용어·도구·탐색 힌트 등 **조회형** 참조. 장문 설계는 `architecture/`·`DESIGN.md`에 둔다. |
| `architecture/` | 경계·레이어·ADR 등 **변경에 비싼 결정**의 근거. 코드가 없어도 선행된다. |
| `architecture/adr/` | 아키텍처 결정 기록(시간순). |
| `sample/todo-app/` | 하네스 규칙을 적용한 **Spring Boot + React** Todo 샘플(별도 CI). |

## 에이전트 실행 모듈 (`AGENTS.md` [3] — 실행)

| 경로 | 목적 |
|------|------|
| `skills/` | 반복 작업의 **절차 캡슐화**. 에이전트가 매번 같은 순서로 품질을 재현하게 한다. |
| `rules/` | **강제 규칙**의 인간 가독 SoT. CI·린터·에디터 규칙과 내용이 어긋나면 CI 우선으로 정합. |
| `evaluations/` | 테스트·루브릭·체크리스트·시나리오 — **증거**를 남기는 평가 시스템. |
| `evaluations/config/` | 자동 점수 가중치·임계값(`auto-score.json`). |
| `evaluations/reports/` | `auto-score` 실행 산출물(`last-run.json`, git 무시 권장). |
| `evaluations/feedback-logs/` | 마스킹된 로그 샘플·재현용 조각(선택). |

## 자동화·검증 (`AGENTS.md` [3] — 자동화)

| 경로 | 목적 |
|------|------|
| `scripts/` | 로컬·CI 공통 검증(구조 하네스 등). “문서만의 주장”을 깨뜨리는 최소 실행 코드. |
| `.github/workflows/` | CI/CD — 푸시/PR마다 구조·(향후) 린트·테스트 게이트. |
| `.cursor/rules/` | IDE에서의 규칙 주입 — `rules/`·`AGENTS.md`와 충돌 시 **문서·CI를 정본**으로 삼는다. |

## 에이전트 탐색 순서 (권장)

1. `AGENTS.md` → 2. `docs/INDEX.md` → 3. `docs/FOLDER_PURPOSE.md`(본 문서) → 4. 작업 관련 `plans/` → 5. `architecture/` 또는 `rules/` → 6. 실행 시 `skills/`

이 순서는 `AGENTS.md` [6] **Agent Legibility**(점진적 정보, 강한 인덱싱)를 만족시키기 위한 것이다.
