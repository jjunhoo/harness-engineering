# 1. Record architecture decisions

Date: 2026-04-20

## Status

Accepted

## Context

하네스 저장소는 AI 에이전트가 주도적으로 변경한다. 비공식 결정은 재현성을 해친다.

## Decision

중요한 아키텍처·정책 결정은 `architecture/adr/`에 ADR로 남긴다.

## Consequences

- 문서 부담 증가 → `plans/`와 링크로 중복을 줄인다.
- 에이전트가 “왜 이렇게 됐는지”를 시간 순으로 추적 가능하다.
