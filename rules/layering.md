# Rule: Layering

- 의존성은 `architecture/LAYERED_MODEL.md`의 단방향만 허용한다.
- 예외는 ADR + 리뷰 2인 승인(`architecture/DEPENDENCY_RULES.md`).

## 에이전트 검증 질문

1. 새 임포트가 역방향인가?
2. `Types`가 프레임워크에 묶였는가?
