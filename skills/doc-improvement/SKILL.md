---
name: doc-improvement
description: 문서 중복·깨진 링크·모호한 용어를 정리하고 하네스 가독성을 높일 때 사용한다.
---

# Doc Improvement

## 절차

1. `docs/INDEX.md`에서 진입 경로가 깨지지 않는지 확인한다.
2. 동일 내용이 둘 이상이면 **한 곳을 SoT**로 정하고 나머지는 링크만 남긴다.
3. 용어는 `references/GLOSSARY.md`와 맞춘다.
4. 변경 이유를 PR 본문에 짧게 적는다.

## 금지

- 외부 위키만 갱신하고 저장소는 그대로 두기
