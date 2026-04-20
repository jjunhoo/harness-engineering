---
name: multi-agent-review
description: PR에 대해 QA·보안 등 역할 분리된 멀티 에이전트 리뷰를 수행할 때 사용한다.
---

# Multi-Agent Review

## 전제

- `docs/MULTI_AGENT_REVIEW.md`를 읽었다.
- PR에 구현 에이전트의 증거(테스트, 로그 요약)가 있다.

## 체크리스트 (리뷰 에이전트)

1. 역할을 선언한다: `REVIEWER_QA` 또는 `REVIEWER_SEC`.
2. `evaluations/rubrics/QUALITY_RUBRIC.md`로 채점하고 근거 링크를 붙인다(QA).
3. `SECURITY.md` 체크리스트를 적용한다(SEC).
4. 결론 형식: **승인 / 변경 요청 / 차단** + 이유 + 재현 또는 완화.
5. 구현 에이전트가 응답할 수 있도록 **구체 파일·라인·테스트명**을 적는다.

## 금지

- 근거 없는 “LGTM”만 남기기
- 역할 없이 상충되는 지시를 동시에 내리기
