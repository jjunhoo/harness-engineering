# 실제 실행 예시 시나리오

에이전트가 **최소 인간 개입**으로 PR까지 도달하는 예이다.

## 배경

- 인간이 “결제 실패 시 사용자에게 재시도 없이 명확한 메시지”를 요청했다고 가정한다.

## 타임라인

1. **T0 인간**: `plans/2026-04-21-payment-error-copy.md` 생성, 제약(PCI, 로그 마스킹) 기입.
2. **T0+5m 에이전트**: `architecture/LAYERED_MODEL.md` 확인 → `Service`에 유스케이스, `UI`에 메시지 매핑.
3. **T0+20m**: 유닛 테스트(성공/실패 경계) + 스냅샷 또는 계약 테스트 초안.
4. **T0+25m**: `skills/self-review/SKILL.md` 체크리스트를 PR 본문에 붙임.
5. **T0+40m 제2 에이전트**: `evaluations/rubrics/QUALITY_RUBRIC.md`로 자기 채점 요청, 로그 마스킹 지적.
6. **T0+55m**: 지적 반영, `bash scripts/harness-validate.sh` 및 언어 테스트 녹색.
7. **T1 CI**: 구조 검증 + 테스트 통과.
8. **T1+10m 인간**: 리뷰 후 머지 (또는 정책상 자동 머지).

## 산출물

- 코드 + 테스트 + (필요 시) `references/GLOSSARY.md` 용어 정리
- PR에 검증 명령과 롤백(플래그/문구 revert) 명시

## 확장 포인트

운영 연동 시: 스테이징 로그 스냅샷을 아티팩트로 첨부해 `references/TOOLS.md` 요구를 충족한다.
