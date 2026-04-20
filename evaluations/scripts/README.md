# Evaluations Scripts

구조 검증은 루트 `scripts/harness-validate.sh`에서 수행한다 (CI와 동일).

에이전트 실행 루프(`docs/WORKFLOW.md`) 자동 게이트는 `scripts/harness-agent-loop.sh`가 호출한다.

## 자동 평가 (구조 · 코드 품질 · 성능)

| 스크립트 | 설명 |
|----------|------|
| `auto-score.sh` | 가중 총점 `overall` 및 차원별 점수 → `../reports/last-run.json` |
| `validate-plan-structure.sh` | 계획 문서 필수 섹션 |
| `check-layer-smoke.sh` | 레이어 스모크(앱 소스 있을 때 확장) |
| `check-pr-body-fields.sh` | PR 본문 필드(GitHub 이벤트) |

설정: `../config/auto-score.json` · 루브릭: `../rubrics/AUTO_SCORE_RUBRIC.md`

## 에이전트 루프 보조

| 스크립트 | 단계 |
|----------|------|
| `validate-plan-structure.sh` | 2 |
| `check-layer-smoke.sh` | 3 |
| `check-pr-body-fields.sh` | 8 |

제품 코드가 생기면 본 디렉터리에 다음을 추가한다.

- 커버리지 게이트
- 레이어 import 검사
- 계약 테스트 래퍼
