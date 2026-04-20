---
name: implement-feature
description: 계획이 있는 기능을 레이어 규칙과 검증과 함께 구현할 때 사용한다.
---

# Implement Feature

## 전제

- `plans/`에 목표·제약·검증 방법이 있다.
- `architecture/LAYERED_MODEL.md`를 읽었다.

## 체크리스트

1. 관련 ADR·문서 링크를 계획서에 추가한다.
2. 타입(`Types`)부터 경계를 고정하고 바깥으로 확장한다.
3. 각 커밋은 CI가 이해 가능한 크기로 유지한다.
4. 테스트: 해피+실패 경계 최소 1개씩.
5. `skills/self-review/SKILL.md` 수행 후 PR을 연다.

## 산출물

- 코드/설정 diff
- 테스트 출력 요약
- PR 본문 필드(`docs/WORKFLOW.md` 참조)
