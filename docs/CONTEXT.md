# 컨텍스트 관리

`AGENTS.md` [9] 원칙의 운영 지침이다.

## 금지

- 단일 초대형 프롬프트에 전 코드베이스+모든 정책을 붙여넣기

## 권장

1. **모듈화된 지식**: 주제별 `docs/`, `architecture/`, `references/`
2. **작업 단위**: `plans/` 파일 하나가 에이전트 한 세션의 상한에 가깝게
3. **관련성**: PR·커밋은 연관 문서 링크를 갱신
4. **최신성**: 문서 상단에 `Last reviewed` (선택) 또는 변경 PR 링크

## 탐색 프로토콜

1. `docs/INDEX.md` (본 허브의 상위)
2. 구조 이해: `docs/FOLDER_PURPOSE.md`
3. 키워드로 `references/GLOSSARY.md`
4. 경계는 `architecture/DEPENDENCY_RULES.md`
5. 실행 방법은 `references/TOOLS.md`

## 컨텍스트 압축

- 장기 브랜치는 주기적으로 `plans/`에 상태 스냅샷을 남긴다.
- 큰 결정은 ADR 형식으로 `architecture/adr/`에 둔다 (첫 ADR은 템플릿과 함께 추가 가능).
