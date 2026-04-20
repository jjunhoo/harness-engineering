#!/usr/bin/env bash
# 계획 문서에 필수 섹션과 비어 있지 않은 본문이 있는지 검사한다 (워크플로 1–2단계 게이트).
set -euo pipefail

if [[ "${1:-}" == "" ]] || [[ ! -f "${1}" ]]; then
  echo "usage: validate-plan-structure.sh <path-to-plan.md>" >&2
  exit 2
fi

PLAN="$1"
fail() { echo "validate-plan-structure: $*" >&2; exit 1; }

need_section() {
  local title="$1"
  grep -qE "^##[[:space:]]+${title}[[:space:]]*$" "$PLAN" || fail "missing section: ## ${title}"
}

section_has_body() {
  local title="$1"
  # awk: after ## Title, collect lines until next ## or EOF; trim; require non-empty
  awk -v t="$title" '
    BEGIN { insec=0; body="" }
    $0 ~ "^##[[:space:]]+"t"[[:space:]]*$" { insec=1; next }
    insec && $0 ~ "^##[[:space:]]" { exit (length(body)>0 ? 0 : 1) }
    insec { body = body $0 "\n" }
    END { if (insec && length(body)==0) exit 1; if (!insec) exit 1 }
  ' "$PLAN" || fail "section ## ${title} is missing or has no body"
}

need_section "Goal"
section_has_body "Goal"

need_section "Verification"
section_has_body "Verification"

need_section "Rollback"
section_has_body "Rollback"

if [[ "${HARNESS_STRICT_PLAN:-0}" == "1" ]]; then
  need_section "Approach"
  section_has_body "Approach"
  if ! grep -qE "^##[[:space:]]+(Constraints|Non-goals)[[:space:]]*$" "$PLAN"; then
    fail "strict mode: need ## Constraints or ## Non-goals"
  fi
fi

echo "validate-plan-structure: OK ($PLAN)"
