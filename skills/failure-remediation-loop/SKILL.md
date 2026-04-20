---
name: failure-remediation-loop
description: CI 실패 또는 로그 기반 이상 징후에 대해 패치 초안과 재검증 루프를 돌릴 때 사용한다.
---

# Failure Remediation Loop

## 전제

- `docs/AUTO_IMPROVEMENT_ON_FAILURE.md`, `docs/LOG_FEEDBACK.md`를 읽었다.
- 자동 머지가 금지인 정책을 따른다(기본).

## 체크리스트

1. **증거 고정**: 실패 로그·스택·재현 커밋 해시를 PR 또는 `plans/`에 남긴다.
2. **분류**: 플레이크 / 환경 / 코드 결함 / 테스트 결함 중 무엇인가.
3. **패치**: 최소 변경으로 실패를 제거한다. 동시에 회귀 테스트를 추가한다(`skills/auto-test-generation`).
4. **CI**: 전체 파이프라인을 다시 돌린다.
5. **승격 판단**: 동일 실패가 2회 이상이면 `skills/incident-to-rule`로 규칙·문서를 갱신한다.

## 에스컬레이션

- 비밀·권한·데이터 마이그레이션은 즉시 인간에게 넘긴다.
