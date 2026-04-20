# Rule: Logging

- 구조화 필드: `timestamp`, `level`, `service`, `correlation_id` (가능 시)
- **금지**: 전체 쿼리스트링에 토큰, 카드번호, 전체 주민번호 등
- 에러: `error.code`, `error.message`(내부), `error.type` — 스택은 길이 제한

운영 스택에 맞게 JSON 또는 표준 포맷을 택하되 **한 서비스 내 일관**을 유지한다.
