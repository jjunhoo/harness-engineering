# Rule: Review

- 최소 1인 승인(팀 정책에 따름). 하드 게이트는 리뷰로 대체 불가.
- 리뷰어는 **증거**를 요구한다: 테스트명, 로그 발췌, 스크린샷.
- 제2 에이전트 리뷰 시: “동의/비동의 + 이유 + 대안” 형식을 권장한다.

## 멀티 에이전트 리뷰 (`docs/MULTI_AGENT_REVIEW.md`)

- 역할 태그를 코멘트 첫 줄에 적는다: `[REVIEWER_QA]` 또는 `[REVIEWER_SEC]`.
- **보안 차단**이 있으면 QA 승인과 무관하게 머지하지 않는다.
- 체크리스트: `evaluations/checklists/MULTI_AGENT_REVIEW.md`.
- 로그 기반 지적은 `docs/LOG_FEEDBACK.md`의 필드명을 인용한다(재현성).

## 자동 생성 테스트

- 자동 생성된 테스트도 **동일 리뷰 기준**을 받는다. “생성됨” 이유만으로 면제되지 않는다(`docs/AUTO_TEST_GENERATION.md`).
