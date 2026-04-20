#!/usr/bin/env bash
# Step 8: GITHUB_EVENT_PATH의 pull_request.body에 Why/What/How verified/Risk 키워드 존재 검사
set -euo pipefail

if [[ -z "${GITHUB_EVENT_PATH:-}" ]] || [[ ! -f "${GITHUB_EVENT_PATH}" ]]; then
  echo "check-pr-body: no GITHUB_EVENT_PATH" >&2
  exit 1
fi

BODY="$(jq -r '.pull_request.body // empty' "${GITHUB_EVENT_PATH}")"
if [[ -z "${BODY// }" ]]; then
  echo "check-pr-body: FAIL — PR body is empty" >&2
  exit 1
fi

fail=0
for label in "Why" "What" "How verified" "Risk"; do
  if ! grep -qiF "${label}" <<<"$BODY"; then
    echo "check-pr-body: FAIL — PR body missing keyword near: ${label}" >&2
    fail=1
  fi
done

if [[ "$fail" != "0" ]]; then
  echo "check-pr-body: see docs/WORKFLOW.md §6 PR 본문 필수 필드" >&2
  exit 1
fi

echo "check-pr-body: OK"
