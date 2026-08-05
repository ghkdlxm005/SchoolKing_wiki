---
title: Compass (컴퍼스)
tags: [weapon, reference]
---

# Compass — 컴퍼스

자동소총. 버스트 성향의 연사 무기.

## 현재 스펙 (최신)

| 항목 | 값 |
| --- | --- |
| 분류 | 자동소총 (FireMode auto) |
| 공격력 | 22 (헤드샷 ×1.5) |
| 공격속도(FireRate) | 0.045s / 발 |
| 버스트 | BurstCount 3 · BurstDelay 0.06 · **BurstCooldownMultiplier 1** |
| 탄창 / 예비 | 15 / 350 |
| 재장전 | 1.51s |
| 탄퍼짐(Spread) | 0.009 |
| 최대 사거리 | 400 |
| 조준 FOV / 속도 | 45 / 0.07 |

> 소스: `ReplicatedStorage.GunSystem.GunConfig.Compass` (+ 누락값은 Default 상속). 3인칭 리그 `r15 compass`, 마커 사운드 `compass_sound`.

## 수정 이력

- **2026-08-04** — 연사 2배(FireRate 0.09→0.045), 탄퍼짐 1.5배(0.006→0.009), **자동사격 전환**(꾹 누르면 연사), 버스트 후 재발사 간격 -50%(BurstCooldownMultiplier 2→1).
- **2026-07** — 애니 마커 → 사운드 이벤트 연결(재장전·발사음 정상화, [BUG-0013](../../../bugs/BUG-0013-compass-marker-sound-path.md)).
- **2026-08-03** — 3인칭 `r15 compass` 리그 + Idle/Equip/Reload/Crouch/Jump/CrouchWalk/Slide 포즈. 장착 시 기본 Handle 숨김.
