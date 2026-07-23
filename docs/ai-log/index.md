---
title: AI 개발 로그 (AI Dev Log)
sidebar_position: 1
tags: [ai-log]
---

import DocCardList from '@theme/DocCardList';

# AI 개발 로그 (AI Dev Log)

날짜별 개발 기록. **설계·판단은 사람, 구현·디버깅은 AI(Claude)** 라는 역할 분담이 드러나도록 남긴다.
각 로그의 핵심은 **개발 전후 비교 표** — 무엇이 어떻게 달라졌고, 어느 스크립트를 건드렸는지.

새 로그는 `docs/_templates/ai-log.md`를 복사해 `YYYY-MM-DD.md`로 만든다.

| 날짜 | 개발 항목 | 관련 |
| --- | --- | --- |
| [2026-07-23](./2026-07-23.md) | R15 슬라이딩 벽 통과 수정, 관중 처치/사망 사운드 A·B 재배치, 발소리 튜닝, 힐 취소 조건 축소, 콘솔 정리 | [BUG-0015](../bugs/BUG-0015-r15-slide-wall-clip.md), [FEAT-0012](../features/FEAT-0012-sound-system.md), [FEAT-0013](../features/FEAT-0013-r6-to-r15-migration.md) |
| [2026-07-19](./2026-07-19.md) | 랭킹/점수 HUD, HUD 화면 맞춤(모바일), 거점 점수 틱·동기화, UI 미표시 버그 / 이동 V1.0.1, Monster Energy 아이템, 리스폰 분산, 피격 피드백 | [BUG-0007](../bugs/BUG-0007-hud-screengui-whitelist.md), [FEAT-0011](../features/FEAT-0011-score-hud-kill-feedback.md), [LESSON-0003](../lessons/LESSON-0003-buff-value-single-source.md) |

<DocCardList />
