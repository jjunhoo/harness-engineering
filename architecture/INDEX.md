# 아키텍처 인덱스

전체 시스템 아키텍처(평면 모델·자동화·확장)는 루트 `DESIGN.md`에 있고, **본 디렉터리는 경계·레이어·결정 기록**에 집중한다. 폴더 존재 이유 전체는 `docs/FOLDER_PURPOSE.md`를 본다.

| 문서 | 내용 |
|------|------|
| `LAYERED_MODEL.md` | Types → … → UI 레이어 정의 |
| `DEPENDENCY_RULES.md` | 허용/금지 의존성 |
| `CODE_LAYOUT.md` | (향후) 애플리케이션 코드 배치 규칙 |
| `adr/0001-record-architecture-decisions.md` | ADR 프로세스 |

에이전트는 구현 전 **본 디렉터리를 스캔**하고 변경이 경계를 넘는지 확인한다.
