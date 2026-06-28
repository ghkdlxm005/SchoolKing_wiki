---
sidebar_position: 1
title: 뷰모델 리깅 · 머즐 (Viewmodel Rigging & Muzzle)
tags: [system, weapon, code]
---

# 뷰모델 리깅 · 머즐 (Viewmodel Rigging & Muzzle)

1인칭 무기 모형(Viewmodel)이 **어떻게 조립(리깅)되고, 레이저/총알이 어디서 나가는지**를 정리한다.
구조 전체는 [코드 구조](../../code-structure.md), 스탯은 [무기 시스템](../combat/weapon-system.md) 참고.
스캔 기준일: **2026-06-24** (Studio 직접 분석). 이후 변경은 이 값과 비교해 추적한다.

## 머즐(발사 지점) 원리

`ClientHandler`는 발사 지점을 **`config.MuzzleFlashPart`** 이름의 파트를 뷰모델에서 찾아 그 **위치**로 쓴다.
레이저·머즐 플래시·총알 모두 같은 파트에서 출발한다.

```lua
local muzzlePart = viewmodel:FindFirstChild(config.MuzzleFlashPart or "pen_tip", true)
local origin = muzzlePart.Position            -- ← 발사가 나가는 곳
local endPos = raycast(origin, camera.LookVector * config.MaxRange)
```

➡️ **리깅에서 머즐 파트를 옮기면 발사 지점도 같이 움직인다.**

## 무기별 머즐 파트 (기준점)

| 무기 | 머즐 파트 | MeshId |
| --- | --- | --- |
| Compass | `pen_tip` | `rbxassetid://138750204422865` |
| LegCrutch | `bolt_reload` | `rbxassetid://138183983076580` |
| Toaster | `cylinder` | `rbxassetid://130483833117679` |
| SiliconGun | `barrel` | `rbxassetid://72818681749725` |

> `config.MuzzleFlashPart`가 뷰모델에 없으면 `pen_tip`으로 폴백 → 엉뚱한 곳/안 나올 수 있으니 이름 일치 주의.

## 무기별 리깅 허브 (Weld/Motor6D 구조)

각 뷰모델은 투명 **허브 파트**(`Main`/`main`, 0.1stud)가 조인트 중심이다.
**Motor6D = 애니메이션으로 움직이는 조인트**(장전·발사 시 회전/이동), **Weld = 고정 부착**.

| 무기 | 허브 | Motor6D (움직임) | Weld (고정) |
| --- | --- | --- | --- |
| Compass | `Main` | cylinder, capRoot, handle, bolt_1, bolt_2 | gear, stuck, R_iron, L_iron |
| LegCrutch | `main` | Relod part, Fire part | front_cover, back_cover, cylinder_side |
| Toaster | `Main` | braed parts, handle parts | body.001/002/003 |
| SiliconGun | `Main` | (없음) | barrel, body, HumanoidRootPart |

> 즉 "리깅을 바꿨다" = 위 허브의 Motor6D/Weld 구성이나 메쉬 부착이 바뀐 것.
> 예) Compass는 볼트·실린더가 Motor6D라 장전 애니에서 움직이고, SiliconGun은 전부 Weld라 고정.

## 공통 파트 규칙

- **PrimaryPart = `HumanoidRootPart`** (뷰모델 위치 기준)
- **조준(ADS)** = `AimPart` (LegCrutch는 `Aimpart` 표기 — 코드가 둘 다 인식)
- **FakeCamera** = hip-fire 시 카메라 부착점 (ADS=AimPart로 보간)

## SiliconGun 상세 (2026-06-26 신규 뷰모델로 교체)

- **신규 리깅 뷰모델** — 직속 **26개 / 전체 57개** 파트, PrimaryPart=HumanoidRootPart, `main`(소문자) 웰드 앵커.
- 머즐 `barrel` — 빔이 **barrel 앞면 끝**에서 출발(카메라 시선과 가장 정렬된 축 보정).
- 겹침 튜브 `foam`(Mac part 본) / `foam 2`(Mac part 2 본) — 정확히 겹쳐 재장전 잔상 원인이었음 → `foam 2` **기본 숨김**, 재장전 시 빠져나간 튜브 자동 숨김. ([FEAT-0003](../../../features/FEAT-0003-silicongun-rework.md), [BUG는 없음·연출])

## 근접 (Dustpan) 리깅 — 머즐 없음

근접무기는 발사 머즐이 없고, **양손 이중 허브**로 검(솔)+방패(쓰레받이)를 든다.

- 허브: `Left Main`(왼손) / `Right Main`(오른손) 두 개
- `MeleeConfig.ArmWeldMap`로 메쉬를 팔에 부착: `handle`·`brush` → RightArm, `body`·`rubber` → LeftArm
- 1인칭은 클립 애니가 아니라 절차적(WalkBob/LookSway). → [애니메이션 세트](./animation-system.md)
- 직속 11개 / 전체 25개 파트

## 수류탄 (Cup/CAN) — 투사체 방식

수류탄은 뷰모델 머즐이 아니라 **물리 투사체**를 던진다(`ThrowEvent`).

| 무기 | 투사체 |
| --- | --- |
| Cup | `GrenadeSystem.ProjectileTemplates.Cup` (메쉬 템플릿 복제) |
| CAN | 절차 생성 원통(`GrenadeConfig.CAN` 속성으로 생성) |

> **CAN 뷰모델(2026-06-26):** 임시 `CANVM`(CupVM 리그 베이스 + can 메쉬 can_body/can_cap/can_clip, 원본 ~20배라 **0.05배 축소**). 정식 리깅본 나오면 교체 예정.

## 변경 시 기록 방법

리깅/머즐을 바꾸면 [변경 이력](../../../changelog.md)에 한 줄 + 위 표 갱신:
`YYYY-MM-DD — [무기] 머즐 파트/MeshId 또는 허브 조인트 변경 — 왜`

#system #weapon #code
