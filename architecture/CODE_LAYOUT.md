# 코드 배치 (향후 애플리케이션)

현 저장소는 **하네스 메타 구조**가 본체다. 제품 코드를 추가할 때 권장 레이아웃이다 (모노레포 예시).

```
src/
  types/        # 순수 타입
  config/
  repo/
  service/
  runtime/
  ui/           # API 핸들러, 웹, CLI 등
```

- 언어별로 `src/` 대신 `cmd/`+`internal/` 등 관용에 맞출 수 있으나 **레이어 의미는 보존**한다.
- 하네스 문서·스킬·규칙은 루트에 유지하고 제품 코드와 섞지 않는다.
- 참고 구현: `sample/todo-app/backend`의 패키지 구조(`domain` → `repository` → `service` → `web`).
