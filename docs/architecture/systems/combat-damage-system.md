---
title: 전투 / 데미지 시스템 (Combat & Damage)
tags: [system, combat]
---

# 전투 / 데미지 시스템

구현: `ServerScriptService/ShieldSystem` (Apex 스타일, 서버 권위). 플레이어·NPC 공통.

## 체력 / 쉴드 (코드 기준)

- **최대 체력 100 + 최대 쉴드 100** (`DEFAULT_MAX_HEALTH=100`, `DEFAULT_MAX_SHIELD=100`)
- 데미지 처리 순서: **쉴드가 먼저 흡수 → 남은 데미지만 체력 감소** (`ShieldSystem.DealDamage`)
- 기본 체력 자연재생 **꺼짐**(빈 `Health` 스크립트). 회복은 `HealHandler`+`HealRequest`(`HealController`).

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

> 메모: 구 기획서의 "쉴드 50"은 현재 코드(쉴드 100)와 다름 — **코드 값(100)이 현재 구현 상태**.

:::warning 2026-06-26 수정
모든 무기 데미지는 **`ShieldSystem.DealDamage` 경유**(쉴드 먼저). CAN이 옛 핸들러 복사본이라 `TakeDamage`로 쉴드를 무시하던 버그를 수정함 — [BUG-0002](../../bugs/BUG-0002-can-shield-bypass.md), 규칙 [LESSON-0002](../../lessons/LESSON-0002-damage-via-shieldsystem.md).
:::

## 연결

판정은 서버 → 결과 표시는 [UI/HUD](./ui-hud-system.md), 점수는 [점수/랭크](./scoring-rank-system.md).
흐름도는 [데이터 흐름](../data-flow.md), 전체 구조는 [코드 구조](../code-structure.md).

#system #combat
