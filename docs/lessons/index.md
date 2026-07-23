---
title: 교훈 (Lessons Learned)
sidebar_position: 1
tags: [lesson]
---

import DocCardList from '@theme/DocCardList';

# 교훈 (Lessons Learned)

버그/실수에서 얻은 **재발 방지 규칙**. 새 교훈은 `docs/_templates/lesson.md` 사용.

| ID | 규칙 | 출처 |
| --- | --- | --- |
| [LESSON-0001](./LESSON-0001-server-authority-timing.md) | 타이밍·판정은 서버 권위로 | [BUG-0001](../bugs/BUG-0001-spawn-invincibility-timing.md) |
| [LESSON-0002](./LESSON-0002-damage-via-shieldsystem.md) | 데미지는 항상 ShieldSystem 경유 | [BUG-0002](../bugs/BUG-0002-can-shield-bypass.md) |
| [LESSON-0003](./LESSON-0003-buff-value-single-source.md) | 버프 값은 단일 함수로만 적용 (변경 시 즉시 반영) | [AI 로그 2026-07-19](../ai-log/2026-07-19.md) |
| [LESSON-0004](./LESSON-0004-toolbox-asset-safety.md) | 툴박스 에셋은 넣기 전에 검사 | [BUG-0008](../bugs/BUG-0008-toolbox-backdoor.md) |
| [LESSON-0005](./LESSON-0005-silent-failure.md) | 조용히 실패하는 코드를 만들지 않는다 | [BUG-0012](../bugs/BUG-0012-viewmodel-left-behind.md), [BUG-0013](../bugs/BUG-0013-compass-marker-sound-path.md), [BUG-0014](../bugs/BUG-0014-audience-outline-and-ambience.md) |

## 하위 문서

<DocCardList />
