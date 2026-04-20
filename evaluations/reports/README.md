# 평가 리포트 (`last-run.json`)

`evaluations/scripts/auto-score.sh`가 **매 실행마다** `last-run.json`을 덮어쓴다.

- Git에는 올리지 않는 것을 권장한다(`.gitignore` 참고).
- CI에서는 아티팩트로 업로드해 에이전트가 읽게 한다(`references/TOOLS.md`).

## 스키마 요약

| 필드 | 설명 |
|------|------|
| `overall` | 가중 총점 0–100 |
| `dimensions.structure` | 구조 점수 + 세부 |
| `dimensions.code_quality` | 코드 품질 점수 + 세부 |
| `dimensions.performance` | 성능 점수 + `duration_ms` |
| `gates` | `hard_fail`, `below_min` 등 |

전체 필드는 생성된 JSON을 SoT로 한다.
