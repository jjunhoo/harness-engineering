---
name: self-review
description: PR 또는 푸시 전에 저자 스스로 결함을 걸러낼 때 사용한다.
---

# Self Review

## 체크리스트

- [ ] 계획(`plans/`)과 구현이 일치하는가
- [ ] 레이어 역방향 의존이 없는가 (`architecture/DEPENDENCY_RULES.md`)
- [ ] 비밀·PII가 포함되지 않았는가 (`SECURITY.md`)
- [ ] 로깅이 `RELIABILITY.md`와 충돌하지 않는가
- [ ] 실패 모드(타임아웃·재시도)가 멱등 원칙을 지키는가
- [ ] 문서·루브릭 갱신이 필요한 변경인가 — 필요 시 반영했는가
- [ ] `./scripts/harness-validate.sh` 로컬 통과 여부

## 출력

PR 설명에 위 항목을 체크박스로 붙여 투명하게 남긴다.
