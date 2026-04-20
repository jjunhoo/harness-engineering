# Rules — 강제 규칙 (`AGENTS.md` [7])

본 디렉터리는 **인간·에이전트 모두가 따라야 하는 규칙**의 SoT(Source of Truth)다. `AGENTS.md`는 다음을 요구한다: 레이어드 아키텍처, 의존성 방향 제한, 경계 검증, 네이밍, 로깅 표준 — 이를 **문서 → 자동화**로 내린다.

## 1. 규칙 파일

| 파일 | 내용 | 향후 자동화 예시 |
|------|------|------------------|
| `layering.md` | 레이어 의존성 | ESLint import 제한, dependency-cruiser |
| `logging.md` | 로깅 필드·금지 데이터 | 로그 린트, 정적 분석 |
| `naming.md` | 네이밍·파일명 | 파일명 린트, PR 봇 |
| `review.md` | 리뷰 최소 기준 | 브랜치 보호, 필수 리뷰어 |

## 2. 정본 우선순위

1. `AGENTS.md` / `DESIGN.md` / `architecture/*`
2. 본 `rules/` 디렉터리
3. CI 설정 및 스크립트
4. `.cursor/rules/*.mdc`(요약) — **본문과 충돌 시 1–3을 갱신하고 요약을 맞춘다.**

## 3. Cursor 연동

`.cursor/rules/harness-engineering.mdc`가 에디터 맥락에 규칙을 주입한다. 저장소의 **법적 효력**은 본 디렉터리와 CI에 있다.
