# 실행 계획 (`plans/`)

인간의 목표를 **에이전트가 실행 가능한 단위**로 쪼갠 문서를 둔다.

- 새 작업: `TEMPLATE.md`를 복사해 `YYYY-MM-DD-<slug>.md`로 저장한다.
- 한 파일은 가능하면 **한 PR** 또는 명확히 나뉜 **하위 마일스톤**에 대응시킨다.

## 링크

- 워크플로: `../docs/WORKFLOW.md`
- 설계 허브: `../docs/INDEX.md`
- 폴더 목적: `../docs/FOLDER_PURPOSE.md`
- 자동 루프: `HARNESS_PLAN=plans/<파일>.md bash ../scripts/harness-agent-loop.sh run --all`
