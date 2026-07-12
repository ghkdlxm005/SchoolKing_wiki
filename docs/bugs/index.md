---
title: 버그 이력 (Bug History)
sidebar_position: 1
tags: [bug]
---

import DocCardList from '@theme/DocCardList';

# 버그 이력 (Bug History)

새 버그는 `docs/_templates/bug.md`를 복사해 `BUG-####-제목.md`로 만든다.

| ID | 제목 | 심각도 | 상태 | 시스템 |
| --- | --- | --- | --- | --- |
| [BUG-0001](./BUG-0001-spawn-invincibility-timing.md) | 스폰 무적 타이밍 예시 | medium | 예시 | spawn |
| [BUG-0002](./BUG-0002-can-shield-bypass.md) | CAN 데미지가 쉴드 무시 | high | fixed | weapon/combat |
| [BUG-0003](./BUG-0003-heal-after-death.md) | 사망 후 힐 실행 | medium | fixed | heal |
| [BUG-0004](./BUG-0004-slide-launch-viewmodel-raycast.md) | 무기 든 채 슬라이딩 시 하늘로 날아감 | high | fixed | movement |
| [BUG-0005](./BUG-0005-respawn-forcefield-sparkle.md) | 리스폰 반짝이·무적·실드 피해 오작동 | medium | fixed | spawn |
| [BUG-0006](./BUG-0006-damage-number-duplicate.md) | 한 발에 데미지 숫자 여러 개 | medium | fixed | ui/weapon |

> 상태: `열림(open)` → `수정 중` → `해결(fixed)` → `재발 감시`
> 심각도: `critical` / `high` / `medium` / `low`

## 📂 하위 문서

<DocCardList />
