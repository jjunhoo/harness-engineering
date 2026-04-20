# Plan: Spring Boot + React Todo 샘플

- **Owner**: harness-sample
- **Created**: 2026-04-20
- **Status**: done

## Goal

하네스 레이어 규칙을 따르는 **Todo REST + React UI** 샘플을 `sample/todo-app/`에 추가한다.

## Constraints

- Java 17, Spring Boot 3.x, 인메모리 H2
- React는 Vite + TypeScript
- 하네스 루트 검증(`harness-validate.sh`) 목록에 샘플 소스 전체를 넣지 않는다(별도 CI)

## Non-goals

- 인증·다중 테넌트·프로덕션 배포

## Approach

1. `sample/todo-app/backend` Maven 구조 및 레이어 패키지
2. `sample/todo-app/frontend` 최소 CRUD UI
3. 경로 필터 CI 워크플로

## Verification

```bash
cd sample/todo-app/backend && mvn -B test
cd sample/todo-app/frontend && npm install && npm run build
```

## Rollback

샘플 디렉터리 및 관련 CI·계획 파일 revert PR로 제거한다.

## Links

- `../sample/todo-app/README.md`
- `../architecture/LAYERED_MODEL.md`
