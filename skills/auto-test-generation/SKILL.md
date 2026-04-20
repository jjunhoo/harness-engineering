---
name: auto-test-generation
description: 구현 변경에 맞춰 회귀를 막는 테스트를 생성·보강할 때 사용한다.
---

# Auto Test Generation

## 전제

- `docs/AUTO_TEST_GENERATION.md`와 해당 `plans/`의 검증 전략을 확인한다.

## 체크리스트

1. 변경된 공개 동작마다 **실패 가능한** 어설션을 하나 이상 둔다.
2. 에러·경계 입력을 포함한다(해피 패스만 금지).
3. I/O가 필요하면 목·픽스처를 명시하고 결정적이게 만든다.
4. PR `How verified`에 테스트 실행 명령을 적는다.
5. E2E가 필요하면 `evaluations/scenarios/`를 갱신하거나 링크한다.

## 완료 정의

- CI에서 동일 테스트가 녹색이다.
- 멀티 리뷰 QA가 “요구사항 반영”을 확인할 수 있다.
