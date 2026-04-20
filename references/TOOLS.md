# 도구 및 관측 접근 (에이전트용)

`AGENTS.md` [5] 요구사항: **에이전트가 로그·메트릭·UI 상태를 직접 읽을 수 있어야 한다.**

## 이 저장소(메타 하네스)의 현재 상태

- **CI 로그**: GitHub Actions 실행 로그 (읽기: PR Checks 탭 또는 API)
- **구조 검증**: 로컬에서 `bash scripts/harness-validate.sh`
- **에이전트 루프(10단계 자동 게이트)**: `bash scripts/harness-agent-loop.sh run --all` — 매핑은 `docs/AGENT_LOOP_STEP_REFERENCE.md`
- **자동 평가(구조·코드 품질·성능 점수)**: `bash evaluations/scripts/auto-score.sh` — 결과 `evaluations/reports/last-run.json`(CI 아티팩트)
- **문서**: 마크다운 전부가 SoT
- **로그 기반 피드백(샘플)**: `evaluations/feedback-logs/` — 절차는 `docs/LOG_FEEDBACK.md`

## 제품 저장소에 연동할 때 (템플릿)

팀은 아래 중 **최소 1개 이상**을 “에이전트 읽기 가능”으로 구성한다.

1. **로그**: JSON 라인을 S3/GCS에 덤프하고 읽기 전용 자격으로 스냅샷 URL을 PR에 첨부
2. **메트릭**: Prometheus `query_range` 결과를 주기적으로 아티팩트로 저장
3. **UI**: Playwright 스크린샷/비디오를 CI 아티팩트로 업로드

에이전트는 **민감정보가 제거된** 스냅샷만 저장소에 남긴다. 원본 대시보드는 사람용으로 유지해도 되나, 하네스 요구를 충족하려면 위와 같은 **복제 가능한 읽기 경로**가 필요하다.

## 권장 MCP / 통합 (선택)

조직에서 승인한 경우에만: Datadog, Grafana, Sentry 등 MCP 연동. 토큰은 저장소 밖.
