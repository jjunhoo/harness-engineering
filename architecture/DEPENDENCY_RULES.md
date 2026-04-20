# 의존성 방향 제한

## 규칙

1. 상위 레이어는 하위 레이어만 임포트한다 (`LAYERED_MODEL.md` 순서).
2. 동일 레이어 패키지 간 **순환 의존 금지**.
3. `Types`는 어떤 애플리케이션 레이어에도 의존하지 않는다.
4. 공유 유틸은 `Types` 또는 별도 `pkg/`(순수)로 승격하거나, 팀이 정한 `internal/shared` 한 곳으로만 둔다.

## 경계 검증 (향후)

애플리케이션 코드가 생기면 `evaluations/scripts/`에 다음 중 하나를 추가한다.

- Go: `go mod` + 패키지 그래프 검사
- TS: ESLint `import/no-restricted-paths` 또는 `dependency-cruiser`
- 기타: 아키텍트가 승인한 정적 검사

## 예외 절차

예외는 ADR에 **이유·기간·대체 계획**을 적고 리뷰 2인 이상 승인을 권장한다.
