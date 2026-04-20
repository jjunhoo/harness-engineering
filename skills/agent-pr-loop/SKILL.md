---
name: agent-pr-loop
description: docs/WORKFLOW.md 2–8단계를 에이전트가 수행할 때의 실무 순서다.
---

# Agent PR Loop

1. **Plan sync** — `plans/` 최신화, 범위 동결
2. **Implement** — `skills/implement-feature/SKILL.md`
3. **Test** — 로컬 + (가능하면) docker 통합
4. **Self-review** — `skills/self-review/SKILL.md`
5. **Peer/agent review** — 코멘트 반영
6. **Open PR** — 검증 명령·스크린샷·위험 기술
7. **Iterate until CI green**

장시간 작업이면 각 단계 끝에 중간 커밋과 짧은 상태 메모를 `plans/`에 남긴다.
