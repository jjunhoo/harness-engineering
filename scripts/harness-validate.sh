#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

required_files=(
  AGENTS.md
  DESIGN.md
  PRODUCT_SENSE.md
  QUALITY_SCORE.md
  RELIABILITY.md
  SECURITY.md
  docs/INDEX.md
  docs/FOLDER_PURPOSE.md
  docs/WORKFLOW.md
  docs/FEEDBACK.md
  docs/CONTEXT.md
  docs/SELF_IMPROVEMENT.md
  docs/EXAMPLE_SCENARIO.md
  docs/MULTI_AGENT_REVIEW.md
  docs/AUTO_TEST_GENERATION.md
  docs/LOG_FEEDBACK.md
  docs/AUTO_IMPROVEMENT_ON_FAILURE.md
  docs/AGENT_LOOP_STEP_REFERENCE.md
  scripts/harness-agent-loop.sh
  evaluations/scripts/validate-plan-structure.sh
  evaluations/scripts/check-layer-smoke.sh
  evaluations/scripts/check-pr-body-fields.sh
  evaluations/scripts/auto-score.sh
  evaluations/config/auto-score.json
  evaluations/rubrics/AUTO_SCORE_RUBRIC.md
  evaluations/reports/README.md
  architecture/INDEX.md
  architecture/LAYERED_MODEL.md
  architecture/DEPENDENCY_RULES.md
  plans/README.md
  plans/TEMPLATE.md
  references/INDEX.md
  references/TOOLS.md
  rules/README.md
  evaluations/README.md
  evaluations/rubrics/QUALITY_RUBRIC.md
  evaluations/feedback-logs/README.md
  skills/README.md
  skills/self-review/SKILL.md
)

required_dirs=(
  docs
  plans
  references
  architecture
  architecture/adr
  skills
  rules
  evaluations
  evaluations/rubrics
  evaluations/checklists
  evaluations/scenarios
  evaluations/feedback-logs
  evaluations/config
  evaluations/reports
  scripts
)

for f in "${required_files[@]}"; do
  if [[ ! -f "$ROOT/$f" ]]; then
    echo "harness-validate: missing required file: $f" >&2
    exit 1
  fi
done

for d in "${required_dirs[@]}"; do
  if [[ ! -d "$ROOT/$d" ]]; then
    echo "harness-validate: missing required directory: $d" >&2
    exit 1
  fi
done

skill_count="$(find "$ROOT/skills" -type f -name SKILL.md 2>/dev/null | wc -l | tr -d ' ')"
if [[ "${skill_count:-0}" -lt 5 ]]; then
  echo "harness-validate: expected at least 5 skills/**/SKILL.md (found ${skill_count:-0})" >&2
  exit 1
fi

echo "harness-validate: OK"
