---
title: 구현 방식 / 컨벤션 (Implementation)
tags: [system, code, event]
---

# 구현 방식 / 컨벤션 (Implementation Conventions)

코드를 추가/수정할 때 지키는 패턴. 2026-06-24 코드 기준.

## 1. 설정(Config) 기반 + 상속

무기 스탯은 코드가 아니라 Config 모듈에 모은다. `setmetatable({...}, {__index = Default})`로 Default 상속.

```lua
GunConfig.Compass = setmetatable({ Damage = 22, ... }, { __index = GunConfig.Default })
```

→ **새 무기 = Config에 블록 추가** + 뷰모델/Tool 연결. 본체 코드는 안 건드림.
Config: `GunConfig`, `GrenadeConfig`, `MeleeConfig`.

## 2. Tool 패턴 (Client/Server 쌍)

무기 1자루 = `StarterPack/<무기>` Tool:

```text
<무기> (Tool)
├── ClientHandler (LocalScript)  -- 입력·조준·뷰모델·반동·연출
└── ServerHandler (Script)       -- 판정·데미지 (서버 권위)
```

## 3. 서버 권위 (Server Authority)

데미지/사망/생성/잔탄은 **서버가 확정**. 클라는 요청·연출만.
데미지는 항상 `ShieldSystem.DealDamage`로 → 쉴드 먼저, 체력 나중. [전투 시스템](./combat-damage-system.md).

## 4. 통신 (RemoteEvent) — 시스템별 Remotes 폴더

| 시스템 | RemoteEvent |
| --- | --- |
| GunSystem | FireEvent, ReloadEvent, ToggleFireModeEvent, MeleeEvent, AmmoUpdateEvent, HitFeedbackEvent, VisualEffectEvent, Sound3DEvent |
| GrenadeSystem | ThrowEvent, StateUpdateEvent |
| MeleeSystem | AttackEvent, ShieldHPEvent, BlockStateEvent |
| 공용 | ShieldUpdate(S→C), HealRequest(C→S) |

## 5. 뷰모델 · 머즐 · 애니메이션

- 뷰모델: `ReplicatedStorage.Viewmodels.<무기>VM`, PrimaryPart=HumanoidRootPart. → [리깅·머즐](./viewmodel-rigging.md)
- 머즐(발사점): `config.MuzzleFlashPart` 이름 파트의 위치.
- 애니메이션: 1인칭/3인칭 분리. → [애니메이션 세트](./animation-system.md)

## 6. 무기 타입별 구현 차이

| 타입 | 판정 방식 | 투사체 |
| --- | --- | --- |
| 총기(히트스캔) | 서버 Raycast | 시각용 트레이서만 |
| 레이저(SiliconGun) | Raycast + 램핑 틱 | 연속 빔 |
| 수류탄 | 물리 투사체 + 폭발/장판 | `ProjectileTemplates`(Cup) 또는 절차생성(CAN) |
| 근접(Dustpan) | `GetPartBoundsInRadius` + 각도 검사 | 없음 (검+방패) |

#system #code #event
