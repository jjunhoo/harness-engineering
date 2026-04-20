# Skills — 반복 작업 정의 (`AGENTS.md` [3])

각 하위 디렉터리는 `SKILL.md` 하나를 둔다. 에이전트는 작업 유형에 맞는 스킬을 **먼저** 로드하고 체크리스트를 따른다. 스킬은 `docs/WORKFLOW.md`의 **실행 루프**를 압축한 모듈이다.

## 스킬 카탈로그

| 스킬 | 용도 | 워크플로 단계(참조) |
|------|------|---------------------|
| `implement-feature/` | 기능 구현 일반 루프 | 3–4 |
| `self-review/` | PR 전 자기 점검 | 5 |
| `doc-improvement/` | 문서 품질·링크·중복 제거 | 7(문서 위주)·지속 |
| `incident-to-rule/` | 사건 → 규칙/테스트 승격 | 머지 후·`SELF_IMPROVEMENT` |
| `quality-evaluation/` | 루브릭 기반 평가 | 9 |
| `agent-pr-loop/` | PR 생성까지의 하네스 루프 | 2–8 |
| `multi-agent-review/` | QA·보안 등 역할 분리 리뷰 | 6 |
| `auto-test-generation/` | 회귀 방지 테스트 생성·보강 | 3–4 |
| `failure-remediation-loop/` | CI/로그 실패 후 패치·재검증 | 7·9·머지 후 |

## 포맷

YAML 프론트매터(`name`, `description`) + 본문 체크리스트. Cursor/Claude 등 클라이언트가 메타데이터로 스킬을 고를 수 있게 한다.

## 원칙

- 스킬은 **정책을 바꾸지 않는다**. 정책 변경은 `rules/`·`architecture/`·ADR이다.
