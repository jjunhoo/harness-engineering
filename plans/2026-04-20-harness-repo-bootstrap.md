# Plan: harness-engineering 저장소 부트스트랩

- **Owner**: harness
- **Created**: 2026-04-20
- **Status**: done

## Goal

`AGENTS.md`에 명시된 디렉터리·문서·자동화를 갖춘 **운영 가능한 하네스 저장소**를 만든다.

## Constraints

- 외부 위키 의존 없이 저장소 내부에 지식을 둔다.
- CI에서 구조 검증이 반드시 실행된다.

## Verification

```bash
bash scripts/harness-validate.sh
```

## Rollback

본 작업은 문서/구조 추가이므로 revert PR로 되돌린다.

## Links

- `../DESIGN.md`
- `../docs/INDEX.md`
