---
sidebar_position: 3
title: 탄약 / 재장전 시스템 (Ammo System)
tags: [system, ammo, weapon]
---

# 탄약 / 재장전 시스템

탄창·예비탄·재장전 시간은 `GunConfig`에 무기별로 정의. 서버가 잔탄을 검증한다.

| 무기 | 탄창 | 예비 | 재장전 | 발사 간격 |
| --- | --- | --- | --- | --- |
| Compass | 15 | 350 | 1.51s | 0.09s (3점사) |
| LegCrutch | 30 | 240 | 2.2s | 0.077s (~13rps) |
| Toaster | 2 | 24 | 2.4s | 0.15s (더블배럴) |
| SiliconGun | 100(에너지) | 300 | 1.8s | 0.09s (틱) |

- 재장전은 `ReloadEvent`(C→S), 잔탄 UI는 `AmmoUpdateEvent`(S→C). → [코드 구조](../../code-structure.md)
- SiliconGun은 탄약 대신 **에너지 틱**을 소모(램핑 데미지).

#system #ammo
