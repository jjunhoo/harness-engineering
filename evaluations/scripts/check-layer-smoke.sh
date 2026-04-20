#!/usr/bin/env bash
# Step 3: 애플리케이션 소스가 없으면 통과. 있으면 금지 패턴 스모크(예: service가 web 프레임워크 직접 참조).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

SRC_DIRS=(src internal cmd pkg)
has_src=0
for d in "${SRC_DIRS[@]}"; do
  if [[ -d "$ROOT/$d" ]]; then
    has_src=1
    break
  fi
done

SAMPLE_SERVICE="$ROOT/sample/todo-app/backend/src/main/java/com/harness/sample/todo/service"

if [[ "$has_src" == "0" ]] && [[ ! -d "$SAMPLE_SERVICE" ]]; then
  echo "check-layer-smoke: SKIP (no src/internal/cmd/pkg and no sample todo service)"
  exit 0
fi

fail() {
  echo "check-layer-smoke: FAIL — $*" >&2
  exit 1
}

if [[ -d "$SAMPLE_SERVICE" ]]; then
  if grep -RIn --include='*.java' -E 'org\.springframework\.web' "$SAMPLE_SERVICE" >/dev/null 2>&1; then
    fail "service layer must not depend on org.springframework.web (see architecture/LAYERED_MODEL.md)"
  fi
  echo "check-layer-smoke: OK (sample todo service has no spring-web imports)"
fi

if [[ "$has_src" == "1" ]]; then
  echo "check-layer-smoke: application source present at repo root — extend this script for import rules"
fi

exit 0
