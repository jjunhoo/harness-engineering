---
name: quality-evaluation
description: 변경에 대해 QUALITY_SCORE 루브릭을 적용하고 증거를 수집할 때 사용한다.
---

# Quality Evaluation

1. `QUALITY_SCORE.md`와 `evaluations/rubrics/QUALITY_RUBRIC.md`를 연다.
2. 자동 점수가 있으면 `bash evaluations/scripts/auto-score.sh`로 생성된 `evaluations/reports/last-run.json`의 `overall`·`dimensions`를 인용한다.
3. 각 차원에 0–3 점을 부여한다. **근거 링크**(커밋, 로그, 테스트명)를 붙인다.
4. 하드 게이트를 하나라도 건드리면 즉시 “불합격”으로 표시한다.
5. 결과를 PR 코멘트 또는 `evaluations/reports/`(팀 관행)에 남긴다.
