# 문서 허브 (Agent Navigation)

에이전트는 **이 파일을 진입점**으로 삼고, 필요한 깊이만큼만 링크를 따라간다.

## 읽기 순서 (권장)

1. `../AGENTS.md` — 최상위 헌장
2. `../DESIGN.md` — 전체 설계
3. `FOLDER_PURPOSE.md` — 폴더·파일 존재 목적
4. `WORKFLOW.md` — 실행 루프
4b. `AGENT_LOOP_STEP_REFERENCE.md` — 단계별 파일·규칙·스크립트 매핑
5. `FEEDBACK.md` — 피드백 층위
6. `CONTEXT.md` — 컨텍스트 관리
7. `SELF_IMPROVEMENT.md` — 자기 개선
8. `EXAMPLE_SCENARIO.md` — 실행 예시
9. `MULTI_AGENT_REVIEW.md` — 멀티 에이전트 리뷰
10. `AUTO_TEST_GENERATION.md` — 자동 테스트 생성
11. `LOG_FEEDBACK.md` — 로그 기반 피드백
12. `AUTO_IMPROVEMENT_ON_FAILURE.md` — 실패 시 자동 개선

## 주제별

| 주제 | 문서 |
|------|------|
| 폴더 구조 목적 | `FOLDER_PURPOSE.md` |
| 멀티 에이전트 리뷰 | `MULTI_AGENT_REVIEW.md` |
| 자동 테스트 생성 | `AUTO_TEST_GENERATION.md` |
| 로그 피드백 | `LOG_FEEDBACK.md` |
| 실패 자동 개선 | `AUTO_IMPROVEMENT_ON_FAILURE.md` |
| 아키텍처 경계 | `../architecture/INDEX.md` |
| 용어·도구 | `../references/INDEX.md` |
| 실행 계획 | `../plans/README.md` |
| 반복 절차 | `../skills/README.md` |
| 평가·루브릭 | `../evaluations/README.md` |
| 강제 규칙 | `../rules/README.md` |
| 샘플 앱 (Todo) | `../sample/todo-app/README.md` |

## 점진적 정보 구조

- **얕음**: 본 파일, 루트 `PRODUCT_SENSE.md`
- **중간**: `architecture/LAYERED_MODEL.md`, `docs/WORKFLOW.md`
- **깊음**: `plans/`의 개별 과제, `evaluations/scenarios/`

모든 “진실”은 저장소 내부에 있어야 한다 (`AGENTS.md` [6]).
