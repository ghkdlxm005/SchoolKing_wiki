---
sidebar_position: 2
title: 전투 / 데미지 시스템 (Combat & Damage)
tags: [system, combat]
---

# 전투 / 데미지 시스템

구현: `ServerScriptService/ShieldSystem` (Apex 스타일, 서버 권위). 플레이어·NPC 공통.

## 체력 / 쉴드 (코드 기준)

- **최대 체력 100 + 최대 쉴드 100** (`DEFAULT_MAX_HEALTH=100`, `DEFAULT_MAX_SHIELD=100`)
- 데미지 처리 순서: **쉴드가 먼저 흡수 → 남은 데미지만 체력 감소** (`ShieldSystem.DealDamage`)
- **무적 차단**: 대상 캐릭터에 `Invincible` 속성이 있으면 데미지 전량 무시(리스폰 5초). → [스폰/리스폰](../meta/spawn-respawn-system.md)
- **전투 시각 기록**: 피격 시 `LastCombatAt`(자동회복 판정용), `LastAttacker`/`LastAttackAt`(처치 귀속용)을 대상 Humanoid에 기록.

### 회복 (2026-07-12 기준)

| 수단 | 내용 |
| --- | --- |
| **체력 자동회복** | 마지막 피격 후 **3초** 경과 시 **초당 10** 회복 (`RegenSystem`). `NoRegen` 속성 모델(예: 소화기)은 제외 |
| **쉴드 회복** | 쉴드템(책) 사용 — 키 4. HP 회복 아이템(과자)은 **삭제**됨 |
| 소지 한도 | 책 최대 **5개**, 리스폰 시 **3개**로 재충전 |

```lua
-- ShieldSystem.DealDamage 요지
local absorbed = math.min(shield, damage)   -- 쉴드가 먼저 막고
setShield(shield - absorbed)
local remaining = damage - absorbed
if remaining > 0 then humanoid:TakeDamage(remaining) end  -- 남은 건 체력
```

## 데미지 계산(무기 측)

`GunConfig`의 `Damage` × 부위 배율(헤드 `HeadshotMultiplier`, 팔다리 `LimbMultiplier`)
× 거리 감쇠(`FalloffStart`~`MaxRange`, 최소 `FalloffMin`). 무기별 값은 [무기 시스템](./weapon-system.md).

- **헤드샷 배율은 1.5로 통일**(2026-07-12). 헤드 판정이 없는 무기(레이저)는 1.0 유지.
- 명중 판정은 서버 Spherecast(반경 0.4) 기반 **히트스캔**.

### 히트 피드백

- 서버가 공격자에게만 `HitSoundEvent` 전송 — 쉴드 명중 / 체력 명중 / **쉴드 파괴(shield_crack)** 구분.
- 데미지 숫자는 공유 `DamageNumbers`가 단독 표시(부위별 색 + 합산). → [UI/HUD](../presentation/ui-hud-system.md), [BUG-0006](../../../bugs/BUG-0006-damage-number-duplicate.md)

> 메모: 구 기획서의 "쉴드 50"은 현재 코드(쉴드 100)와 다름 — **코드 값(100)이 현재 구현 상태**.

:::warning 2026-06-26 수정
모든 무기 데미지는 **`ShieldSystem.DealDamage` 경유**(쉴드 먼저). CAN이 옛 핸들러 복사본이라 `TakeDamage`로 쉴드를 무시하던 버그를 수정함 — [BUG-0002](../../../bugs/BUG-0002-can-shield-bypass.md), 규칙 [LESSON-0002](../../../lessons/LESSON-0002-damage-via-shieldsystem.md).
:::

## 연결

판정은 서버 → 결과 표시는 [UI/HUD](../presentation/ui-hud-system.md), 점수는 [점수/랭크](../meta/scoring-rank-system.md).
흐름도는 [데이터 흐름](../../data-flow.md), 전체 구조는 [코드 구조](../../code-structure.md).

#system #combat
