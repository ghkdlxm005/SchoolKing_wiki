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
| [BUG-0007](./BUG-0007-hud-screengui-whitelist.md) | 새로 만든 HUD가 화면에 안 나옴 | high | fixed | ui |
| [BUG-0008](./BUG-0008-toolbox-backdoor.md) | 무료 모델 백도어 (가짜 Error 501) | **critical** | fixed | security |
| [BUG-0009](./BUG-0009-spawn-orientation-reset.md) | 스폰 시 캐릭터가 반대 방향을 봄 | medium | fixed | spawn |
| [BUG-0010](./BUG-0010-weapon-server-validation-gaps.md) | 무기 발사 서버 검증 구멍 3건 | high | **open** | weapon/security |
| [BUG-0011](./BUG-0011-archived-hit-sound-assets.md) | 타격음 2종 재생 실패 (에셋 아카이브) | medium | **open** | sound |

> 상태: `열림(open)` → `수정 중` → `해결(fixed)` → `재발 감시`
> 심각도: `critical` / `high` / `medium` / `low`

## 📂 하위 문서

<DocCardList />
