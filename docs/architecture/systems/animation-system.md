---
title: 애니메이션 시스템 (Animation Set)
tags: [system, weapon, animation, code]
---

# 애니메이션 시스템 (Animation Set)

무기별 애니메이션 클립 구성. 1인칭(뷰모델)과 3인칭(캐릭터)이 분리되어 있다.
스캔 기준: **2026-06-24**. 이후 애니메이션 추가/수정은 이 목록과 비교해 추적한다.

## 위치

- 총기: `ReplicatedStorage.GunSystem.Animations.<무기>` (+ `ThirdPerson/` 하위)
- 수류탄: `ReplicatedStorage.GrenadeSystem.Animations.<Cup|CAN>`
- 근접: `ReplicatedStorage.MeleeSystem.Animations.Dustpan`
- `AnimPreloader`(StarterPlayerScripts)가 미리 로드

## 총기 1인칭 애니메이션

| 무기 | 클립 |
| --- | --- |
| Compass (10) | Idle, Equip, AimIn, AimOut, Fire, FireAim, Reload, Run, Melee, Tilt |
| LegCrutch (10) | Idle, Equip, AimIn, AimOut, Fire, FireAim, Reload, Run, Melee, Tilt |
| Toaster (17) | 위 10 + FireLeft, FireRight, ReloadDedicated, Pour, PourReload, BreadLeft, BreadRight |
| SiliconGun (10) | Idle*, Equip, AimIn*, AimOut*, Fire(빔), FireAim(빔), Reload, Run, Melee*, Tilt — `*`=미등록 ([FEAT-0003](../../features/FEAT-0003-silicongun-rework.md)) |

> Toaster가 많은 이유: **더블배럴**(FireLeft/Right) + **3단계 차지(Pour/PourReload)** + 빵 연출(Bread) 때문.

**2026-06-26 변경:**
- SiliconGun 전용 애니 등록 — Equip `82424620672014`, Reload `90548560652608`, Tilt `116759963207169`, Run `136540259610641`. Fire/FireAim는 비움(연속 빔). Idle·AimIn·AimOut·Melee 미등록(추후).
- Toaster `ReloadDedicated` 교체 `104203568840410` → `108963317284184`. `HandleUp` 애니/코드 삭제. `FireRight`(2발째) 우선순위 Action3 → **Action4**.

## 총기 3인칭 애니메이션 (`ThirdPerson/`)

| 무기 | 클립 |
| --- | --- |
| Compass / LegCrutch / Toaster / **SiliconGun** | Idle, Equip, Reload, Aim, Fire (각 5) |

## 수류탄 애니메이션 (3인칭)

| 무기 | 클립 |
| --- | --- |
| Cup | Idle, Equip, Throw |
| CAN | Idle, Equip, Throw |

## 근접 애니메이션 (Dustpan, 3인칭)

| 무기 | 클립 |
| --- | --- |
| Dustpan | Idle, Equip, Swing, Block |

> 근접 **1인칭**은 클립이 아니라 **절차적(procedural)** — `MeleeConfig`의 `WalkBob*`/`LookSway`/`ArmWeldMap`으로 양팔을 코드로 흔든다(애니 ID 비어 있음).

## 공통 연출 모듈 (`SharedFX`)

`SlideTilt`, `RunTilt`, `ThirdPersonAnims` — 슬라이드/달리기 기울임 등 공용 절차 연출.

#system #weapon #animation
