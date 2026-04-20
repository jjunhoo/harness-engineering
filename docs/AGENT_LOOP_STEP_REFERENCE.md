# 에이전트 실행 루프 — 단계별 파일·규칙 참조

`docs/WORKFLOW.md` 10단계와 1:1로 대응한다. **자동 실행**은 `bash scripts/harness-agent-loop.sh run --all` (선택: `HARNESS_PLAN`, `HARNESS_STRICT_PLAN=1`).

| 단계 | 설명 | 자동 검증 (`harness-agent-loop.sh`) | 필수/참고 문서 | 규칙 `rules/` | 스킬 `skills/` | 기타 스크립트·평가 |
|------|------|-------------------------------------|-----------------|---------------|----------------|---------------------|
| 1 | 인간이 작업 정의 | ✅ 계획 파일 존재·경로 권장 | `plans/TEMPLATE.md`, `plans/README.md`, `plans/*.md` | `rules/naming.md` | — | `HARNESS_PLAN` 또는 `plans/20*.md` 자동 탐색 |
| 2 | 에이전트 실행 계획 | ✅ `validate-plan-structure.sh` | 위 계획 + `docs/WORKFLOW.md` §4 | `rules/review.md`(계획·PR 정합) | `agent-pr-loop`, `implement-feature` | `evaluations/scripts/validate-plan-structure.sh` |
| 3 | 코드 작성 | ✅ `check-layer-smoke.sh`(소스 있을 때 확장) | `architecture/LAYERED_MODEL.md`, `architecture/DEPENDENCY_RULES.md`, `DESIGN.md` §3 | `layering.md`, `logging.md`, `naming.md` | `implement-feature` | (향후 import 린트) |
| 4 | 테스트 실행 | ✅ `harness-validate.sh` | `docs/AUTO_TEST_GENERATION.md`, `QUALITY_SCORE.md` | `review.md` | `auto-test-generation` | 제품 테스트 러너(도입 시) |
| 5 | 자기 리뷰 | ⚙️ `HARNESS_SELF_REVIEW_FILE` 있으면 비어 있지 않은지 | `skills/self-review/SKILL.md` | `review.md` | `self-review` | 없으면 SKIP(PR 본문 수동) |
| 6 | 멀티 에이전트 리뷰 | ⏭ CI 단독 불가 | `docs/MULTI_AGENT_REVIEW.md` | `review.md` | `multi-agent-review` | `evaluations/checklists/MULTI_AGENT_REVIEW.md` |
| 7 | 수정 반복 | ✅ 4와 동일 게이트(회귀) | `docs/AUTO_IMPROVEMENT_ON_FAILURE.md` | 동일 | `failure-remediation-loop` | `harness-validate.sh` |
| 8 | PR 생성 | ✅ PR 이벤트 시 본문 키워드 | `docs/WORKFLOW.md` §6 | `review.md` | `agent-pr-loop` | `evaluations/scripts/check-pr-body-fields.sh` |
| 9 | 검증 | ✅ `harness-validate.sh` + **`evaluations/scripts/auto-score.sh`** | `evaluations/README.md`, `QUALITY_SCORE.md`, `evaluations/rubrics/AUTO_SCORE_RUBRIC.md` | 전 `rules/` | `quality-evaluation` | CI `Harness CI` · `auto-score` 잡 · `reports/last-run.json` 아티팩트 |
| 10 | 머지 | ⏭ 인간/브랜치 보호 | `SECURITY.md`, `PRODUCT_SENSE.md` | `review.md` | — | GitHub 브랜치 설정 |

**범례:** ✅ 기본 자동, ⚙️ 환경 변수 시 자동, ⏭ 자동 아님(프로세스/플랫폼).

## 환경 변수

| 변수 | 단계 | 의미 |
|------|------|------|
| `HARNESS_PLAN` | 1–2 | 검증할 계획 파일 경로 |
| `HARNESS_STRICT_PLAN=1` | 2 | `Approach` + `Constraints` 또는 `Non-goals` 필수 |
| `HARNESS_SELF_REVIEW_FILE` | 5 | 자기 리뷰 산출물 파일(비어 있지 않아야 함) |

## CI에서의 실행

`.github/workflows/harness-ci.yml`의 **agent-loop** 잡이 본 문서의 자동 가능 단계를 실행한다. **auto-score** 잡이 9단계에 해당하는 **가중 점수 평가**를 수행한다. PR에서는 `GITHUB_EVENT_PATH`가 설정되어 8단계 PR 본문 검사가 동작한다.

## 로컬 예시

```bash
export HARNESS_PLAN=plans/2026-04-20-harness-repo-bootstrap.md
bash scripts/harness-agent-loop.sh run --all
bash scripts/harness-agent-loop.sh run --step 2 --plan "$HARNESS_PLAN"
```

## 상위 설계

- 루프 SoT: `docs/WORKFLOW.md`
- 철학: `AGENTS.md` [4]
