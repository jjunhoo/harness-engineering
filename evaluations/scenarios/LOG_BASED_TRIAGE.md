# 시나리오: 로그 기반 트리아지

## 목적

에이전트가 **로그 스냅샷만**으로 장애 등급을 매기고 다음 행동을 제안하는지 검증한다.

## Given

- `evaluations/feedback-logs/` 또는 CI 아티팩트에 마스킹된 JSONL 샘플
- `correlation_id`가 동일한 요청 묶음이 3건 이상 존재

## When

- 트리아지 에이전트가 `docs/LOG_FEEDBACK.md` 절차를 따른다.

## Then

- 상위 1개 이슈에 대해: 증상, 가설, 재현 명령, 권장 패치 범위가 문서화된다.
- 민감 필드가 샘플에 포함되지 않았다.

## 연동

- 자동 개선: `docs/AUTO_IMPROVEMENT_ON_FAILURE.md`
- 스킬: `skills/failure-remediation-loop/SKILL.md`
