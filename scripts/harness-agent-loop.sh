#!/usr/bin/env bash
# 에이전트 실행 루프(10단계) 중 CI·로컬에서 자동 검증 가능한 게이트를 실행한다.
# 단계·파일·규칙 매핑: docs/AGENT_LOOP_STEP_REFERENCE.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REF_DOC="docs/AGENT_LOOP_STEP_REFERENCE.md"

usage() {
  sed -n '1,80p' <<'EOF'
usage: harness-agent-loop.sh <command> [options]

commands:
  steps              각 단계별 사용 파일·규칙 안내(REF_DOC 경로 출력)
  run [--plan PATH] [--step N|--all]  자동 게이트 실행
  discover-plan      수정 시각 기준 최신 plans/20*.md 경로 출력(없으면 비어 있음)

options:
  --plan PATH        검증할 계획 파일 (1–2단계). 없으면 discover 또는 HARNESS_PLAN
  --step N           1..10 중 해당 단계만 (자동화 없으면 스킵 메시지)
  --all              자동화된 전 단계 일괄 실행(기본)

환경 변수:
  HARNESS_PLAN       --plan 기본값
  HARNESS_STRICT_PLAN=1  계획에 Approach·Constraints/Non-goals 강제
EOF
}

discover_plan() {
  local latest=""
  local f
  shopt -s nullglob
  for f in "$ROOT/plans"/20*.md; do
    [[ -f "$f" ]] || continue
    if [[ -z "$latest" ]] || [[ "$f" -nt "$latest" ]]; then
      latest="$f"
    fi
  done
  shopt -u nullglob
  if [[ -n "$latest" ]]; then
    echo "$latest"
  fi
}

run_step() {
  local n="$1"
  local plan="${2:-}"
  case "$n" in
    1)
      echo "== Step 1: 작업 정의 (계획 파일 존재) =="
      if [[ -z "$plan" ]] || [[ ! -f "$plan" ]]; then
        echo "harness-agent-loop: FAIL — 계획 파일이 없습니다. --plan 또는 HARNESS_PLAN 을 지정하세요." >&2
        exit 1
      fi
      case "$plan" in
        "$ROOT"/plans/*) ;;
        *)
          echo "harness-agent-loop: WARN — 계획은 저장소 plans/ 아래에 두는 것을 권장합니다: $plan" >&2
          ;;
      esac
      echo "OK: plan file exists: $plan"
      ;;
    2)
      echo "== Step 2: 실행 계획 (템플릿 대비 구조) =="
      if [[ -z "$plan" ]] || [[ ! -f "$plan" ]]; then
        echo "harness-agent-loop: FAIL — 2단계 검증에 계획 파일이 필요합니다." >&2
        exit 1
      fi
      bash "$ROOT/evaluations/scripts/validate-plan-structure.sh" "$plan"
      ;;
    3)
      echo "== Step 3: 코드/구조 (레이어 키워드 스모크) =="
      bash "$ROOT/evaluations/scripts/check-layer-smoke.sh"
      ;;
    4|7)
      echo "== Step $n: 테스트/반복 (하네스 구조 + 스킬 수) =="
      bash "$ROOT/scripts/harness-validate.sh"
      ;;
    5)
      echo "== Step 5: 자기 리뷰 (선택 파일) =="
      if [[ -n "${HARNESS_SELF_REVIEW_FILE:-}" ]] && [[ -f "${HARNESS_SELF_REVIEW_FILE}" ]]; then
        if [[ ! -s "${HARNESS_SELF_REVIEW_FILE}" ]]; then
          echo "harness-agent-loop: FAIL — HARNESS_SELF_REVIEW_FILE is empty" >&2
          exit 1
        fi
        echo "OK: self-review artifact present: ${HARNESS_SELF_REVIEW_FILE}"
      else
        echo "SKIP: HARNESS_SELF_REVIEW_FILE 미설정 — PR 본문 체크리스트는 수동·에이전트가 채움 (skills/self-review/SKILL.md)"
      fi
      ;;
    6)
      echo "== Step 6: 멀티 에이전트 리뷰 =="
      echo "SKIP: CI 단독으로 리뷰 코멘트 검증 불가 — PR에서 REVIEWER_QA/SEC 적용 (docs/MULTI_AGENT_REVIEW.md)"
      ;;
    8)
      echo "== Step 8: PR 본문 (GitHub Actions에서만 엄격 검사) =="
      if [[ "${GITHUB_EVENT_NAME:-}" == "pull_request" ]] && [[ -n "${GITHUB_EVENT_PATH:-}" ]]; then
        bash "$ROOT/evaluations/scripts/check-pr-body-fields.sh" || exit 1
      else
        echo "SKIP: 로컬에서는 PR 이벤트 없음. CI의 agent-loop job 참고."
      fi
      ;;
    9)
      echo "== Step 9: 검증 (구조 하네스) =="
      bash "$ROOT/scripts/harness-validate.sh"
      ;;
    10)
      echo "== Step 10: 머지 =="
      echo "SKIP: 머지는 인간/브랜치 보호 정책 (AGENTS.md [4] 10단계)"
      ;;
    *)
      echo "harness-agent-loop: unknown step: $n" >&2
      exit 2
      ;;
  esac
}

cmd="${1:-}"
shift || true

PLAN="${HARNESS_PLAN:-}"
STEP=""
RUN_ALL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --plan) PLAN="${2:-}"; shift 2 ;;
    --step) STEP="${2:-}"; shift 2 ;;
    --all) RUN_ALL=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown arg: $1" >&2; usage; exit 2 ;;
  esac
done

case "${cmd:-}" in
  "")
    usage
    exit 2
    ;;
  steps)
    echo "단계·파일·규칙 매핑: $ROOT/$REF_DOC"
    ;;
  discover-plan)
    discover_plan || true
    ;;
  run)
    if [[ -z "$PLAN" ]]; then
      PLAN="$(discover_plan || true)"
    fi
    if [[ -z "$PLAN" ]]; then
      echo "harness-agent-loop: WARN — 계획 파일을 찾지 못했습니다. 1–2단계 스킵. HARNESS_PLAN 또는 plans/20*.md 추가." >&2
    fi
    if [[ "$RUN_ALL" == "1" ]] || [[ -z "$STEP" ]]; then
      if [[ -n "$PLAN" ]]; then
        run_step 1 "$PLAN"
        run_step 2 "$PLAN"
      else
        echo "== Step 1–2: SKIP (no plan) =="
      fi
      run_step 3 ""
      run_step 4 ""
      run_step 5 ""
      run_step 6 ""
      run_step 7 ""
      run_step 8 ""
      run_step 9 ""
      run_step 10 ""
    else
      if [[ -z "$PLAN" ]] && [[ "$STEP" == "1" || "$STEP" == "2" ]]; then
        PLAN="$(discover_plan || true)"
      fi
      run_step "$STEP" "$PLAN"
    fi
    echo "harness-agent-loop: completed"
    ;;
  *)
    echo "unknown command: $cmd" >&2
    usage
    exit 2
    ;;
esac
