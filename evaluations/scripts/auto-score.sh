#!/usr/bin/env bash
# 자동 평가: 구조(structure) · 코드 품질(code_quality) · 성능(performance) 점수화
# 설정: evaluations/config/auto-score.json  루브릭: evaluations/rubrics/AUTO_SCORE_RUBRIC.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

CONFIG="$ROOT/evaluations/config/auto-score.json"
OUT="$ROOT/evaluations/reports/last-run.json"
START_MS="$(python3 -c 'import time; print(int(time.time()*1000))')"

need_jq() {
  command -v jq >/dev/null 2>&1 || { echo "auto-score: jq required" >&2; exit 1; }
}

scan_secrets_in_shell() {
  local hits=0
  local files
  files="$(git -C "$ROOT" ls-files 2>/dev/null | grep -E '\.(sh|bash)$' || true)"
  if [[ -z "$files" ]]; then
    echo "0"
    return
  fi
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    if grep -EIn 'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|AKIA[0-9A-Z]{16}|xox[baprs]-[0-9A-Za-z-]{10,}' "$ROOT/$f" >/dev/null 2>&1; then
      hits=1
      echo "auto-score: secret_pattern in $f" >&2
    fi
  done <<<"$files"
  echo "$hits"
}

score_code_quality() {
  local score=100
  local details=()
  local hits
  hits="$(scan_secrets_in_shell)"
  if [[ "$hits" != "0" ]]; then
    jq -n --argjson score 0 --argjson hard true \
      '{score: $score, details: ["high-risk secret-like pattern in shell script"], hard_secret_fail: $hard}'
    return
  fi

  local pen miss_pen
  pen="$(jq -r '.code_quality.shellcheck_penalty_per_file // 12' "$CONFIG")"
  miss_pen="$(jq -r '.code_quality.shellcheck_missing_penalty // 15' "$CONFIG")"

  if command -v shellcheck >/dev/null 2>&1; then
    local failed=0
    local f
    while IFS= read -r -d '' f; do
      if ! shellcheck "$f" >/dev/null 2>&1; then
        failed=$((failed + 1))
        details+=("shellcheck: $f")
      fi
    done < <(find "$ROOT/scripts" "$ROOT/evaluations/scripts" -type f -name '*.sh' -print0 2>/dev/null)
    if [[ "$failed" -gt 0 ]]; then
      local dec=$((failed * pen))
      score=$((score - dec))
      if [[ "$score" -lt 0 ]]; then score=0; fi
    fi
  else
    score=$((score - miss_pen))
    if [[ "$score" -lt 0 ]]; then score=0; fi
    details+=("shellcheck not installed (penalty $miss_pen)")
  fi

  local detail_json
  if [[ "${#details[@]}" -eq 0 ]]; then
    detail_json='[]'
  else
    detail_json="$(printf '%s\n' "${details[@]}" | jq -R . | jq -s .)"
  fi
  jq -n --argjson score "$score" --argjson details "$detail_json" '{score: $score, details: $details, hard_secret_fail: false}'
}

performance_from_ms() {
  local ms="$1"
  local ex go acc
  ex="$(jq -r '.performance.excellent_ms' "$CONFIG")"
  go="$(jq -r '.performance.good_ms' "$CONFIG")"
  acc="$(jq -r '.performance.acceptable_ms' "$CONFIG")"
  local s=0
  if [[ "$ms" -le "$ex" ]]; then
    s=100
  elif [[ "$ms" -le "$go" ]]; then
    s=$((100 - (ms - ex) * 20 / (go - ex + 1)))
    if [[ "$s" -lt 70 ]]; then s=70; fi
  elif [[ "$ms" -le "$acc" ]]; then
    s=$((70 - (ms - go) * 40 / (acc - go + 1)))
    if [[ "$s" -lt 35 ]]; then s=35; fi
  else
    s=$((35 - (ms - acc) / 2000))
    if [[ "$s" -lt 0 ]]; then s=0; fi
  fi
  echo "$s"
}

main() {
  need_jq
  [[ -f "$CONFIG" ]] || { echo "auto-score: missing $CONFIG" >&2; exit 1; }

  local struct_json
  if bash "$ROOT/scripts/harness-validate.sh" >/dev/null 2>&1; then
    struct_json="$(jq -n --argjson score 100 --arg d "harness-validate: OK" '{score: $score, details: [$d]}')"
  else
    struct_json="$(jq -n --argjson score 0 --arg d "harness-validate: FAIL" '{score: $score, details: [$d]}')"
  fi

  local cq_json
  cq_json="$(score_code_quality)"

  local END_MS total_ms perf_score
  END_MS="$(python3 -c 'import time; print(int(time.time()*1000))')"
  total_ms=$((END_MS - START_MS))
  perf_score="$(performance_from_ms "$total_ms")"

  local ws wq wp s_score q_score overall
  ws="$(jq -r '.weights.structure' "$CONFIG")"
  wq="$(jq -r '.weights.code_quality' "$CONFIG")"
  wp="$(jq -r '.weights.performance' "$CONFIG")"
  s_score="$(echo "$struct_json" | jq -r '.score')"
  q_score="$(echo "$cq_json" | jq -r '.score')"
  overall="$(python3 -c "print(int(round(float('$s_score')*float('$ws') + float('$q_score')*float('$wq') + float('$perf_score')*float('$wp'))))")"

  local hard=false
  if [[ "$(echo "$cq_json" | jq -r '.hard_secret_fail // false')" == "true" ]]; then
    hard=true
    overall=0
  fi
  if [[ "$s_score" == "0" ]]; then
    hard=true
  fi

  local min_overall fail_ci below=false
  min_overall="$(jq -r '.gates.min_overall // 0' "$CONFIG")"
  fail_ci="$(jq -r '.gates.fail_ci_below_min // false' "$CONFIG")"
  if [[ "$overall" -lt "$min_overall" ]]; then
    below=true
  fi

  mkdir -p "$ROOT/evaluations/reports"

  jq -n \
    --argjson version 1 \
    --arg ts "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
    --argjson overall "$overall" \
    --argjson structure "$struct_json" \
    --argjson code_quality "$cq_json" \
    --argjson perf_score "$perf_score" \
    --argjson duration_ms "$total_ms" \
    --argjson total_ms "$total_ms" \
    --argjson hard "$hard" \
    --argjson below "$below" \
    --argjson min_overall "$min_overall" \
    '{
      version: $version,
      timestamp: $ts,
      overall: $overall,
      dimensions: {
        structure: $structure,
        code_quality: $code_quality,
        performance: {
          score: $perf_score,
          duration_ms: $duration_ms,
          details: ["measured: full auto-score wall time"]
        }
      },
      meta: {total_wall_ms: $total_ms},
      gates: {hard_fail: $hard, below_min: $below, min_overall: $min_overall}
    }' >"$OUT"

  echo "auto-score: wrote $OUT (overall=$overall)"
  cat "$OUT"

  if [[ "$hard" == "true" ]]; then
    echo "auto-score: HARD FAIL" >&2
    exit 1
  fi
  if [[ "$below" == "true" && "$fail_ci" == "true" ]]; then
    echo "auto-score: overall $overall < min $min_overall" >&2
    exit 1
  fi
}

main "$@"
