# Evaluations — 테스트 및 자동 평가 시스템

`AGENTS.md` [5][7][10]-5에 따라, 본 디렉터리는 **주장이 아니라 증거**를 남기는 품질 평면의 중심이다.

## 1. 설계 목표

- **재현 가능**: 동일 커밋에서 동일한 평가 명령이 동일 결과를 낸다(플레이크는 별도 관리).
- **에이전트 가독**: 결과가 PR·CI 로그·아티팩트로 남고, `references/TOOLS.md`에 읽는 방법이 있다.
- **층별 피드백**: 유닛 → 통합 → 시나리오 → 운영 신호로 이어지는 파이프라인과 정렬(`docs/FEEDBACK.md`).

## 2. 자동 점수화 (코드 품질 · 구조 · 성능)

| 항목 | 경로 |
|------|------|
| 실행 스크립트 | `evaluations/scripts/auto-score.sh` |
| 가중치·임계값 | `config/auto-score.json` |
| 사람이 읽는 루브릭 | `rubrics/AUTO_SCORE_RUBRIC.md` |
| 출력(JSON) | `reports/last-run.json` (git 무시 권장) |

### 차원

| 차원 | 점수 | 자동 근거 |
|------|------|-----------|
| **구조** (`structure`) | 0–100 | `scripts/harness-validate.sh` 통과 여부 |
| **코드 품질** (`code_quality`) | 0–100 | `shellcheck` 결과(설치 시), 셸 스크립트 비밀 패턴 스캔 |
| **성능** (`performance`) | 0–100 | `auto-score` **전체 벽시계 시간** 대비 임계(`config`의 `performance.*_ms`) |

가중 총점 `overall`은 `config/auto-score.json`의 `weights`로 계산된다. `gates.min_overall` 미달 시 CI 실패(`fail_ci_below_min`).

### 실행

```bash
bash evaluations/scripts/auto-score.sh
```

CI: `.github/workflows/harness-ci.yml`의 **`auto-score`** 잡에서 실행 후 `last-run.json`을 아티팩트로 업로드한다.

## 3. 디렉터리 구성

| 하위 | 용도 | `AGENTS.md` 대응 |
|------|------|------------------|
| `config/` | 자동 평가 설정(JSON) | [7] |
| `rubrics/` | 차원별 채점 기준(정성+자동 매핑) | [10]-5 |
| `checklists/` | 사람/에이전트 병행 최종 확인 | [4] 9단계 |
| `scenarios/` | E2E·복구·부하 등 서술형 시나리오 | [5] 통합·시나리오 |
| `scripts/` | 구조 검증·자동 점수 등 | [7] 자동 검증 |
| `reports/` | `last-run.json` 등 실행 산출물 | [5] |
| `feedback-logs/` | 마스킹 로그 샘플(`docs/LOG_FEEDBACK.md`) | [5] |
| `agent-loop-checklist.md` | 10단계 루프 요약 | [4] |

## 4. `QUALITY_SCORE.md`와의 관계

루트 `QUALITY_SCORE.md`는 PR 단위 **정성 차원**(명세·테스트·가독성 등)을 정의한다. 본 디렉터리의 **`overall`(0–100)**은 **자동화 가능한 하위 집합**이며, CI 게이트로 사용한다. 정성 루브릭은 `rubrics/QUALITY_RUBRIC.md`를 본다.

## 5. 평가 실행 순서 (권장)

1. `bash scripts/harness-validate.sh`
2. `bash evaluations/scripts/auto-score.sh`
3. PR: CI에서 위 두 단계 + (필요 시) 언어별 테스트
4. 변경 성격에 따라 `rubrics/QUALITY_RUBRIC.md` 자기 채점 첨부

## 6. 원칙

평가는 **재현 가능**해야 하며, 결과는 에이전트가 PR에서 읽을 수 있어야 한다. 운영 지표만 사람이 볼 수 있는 형태로 남는 것은 `PRODUCT_SENSE.md`의 “나쁜 지름길”에 해당한다.
