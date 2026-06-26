---
title: "BUG-0002 CAN 데미지가 쉴드 무시"
tags: [bug, weapon, combat]
---

# BUG-0002 — CAN 데미지가 쉴드를 무시하고 체력 직접 깎음

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-06-26) |
| 심각도 | high |
| 관련 시스템 | [전투/데미지](../architecture/systems/combat-damage-system.md), [무기](../architecture/systems/weapon-system.md) |
| 관련 기능 | [FEAT-0001 CAN](../features/FEAT-0001-grenade-fragmentation.md) |
| 발견일 | 2026-06-26 |

## 증상

CAN(탄산캔) 폭발·장판 데미지가 **쉴드를 건너뛰고 체력을 직접** 깎았다. 다른 무기는 쉴드부터 닳는데 CAN만 달랐다.

## 원인

`CAN/ServerHandler`가 **Cup 핸들러의 옛 복사본**이라, 데미지 적용을 `hum:TakeDamage()`로 직접 호출했다.
`TakeDamage`는 Humanoid 체력만 깎고 쉴드(플레이어 속성)를 모른다.

## 해결

데미지 3곳(DOT 틱 2 + 폭발 1)을 모두 **`ShieldSystem.DealDamage(hum, ...)`** 로 교체.
→ 쉴드가 먼저 흡수되고 남은 만큼 체력 감소. ([ShieldSystem](../architecture/systems/combat-damage-system.md))

## 재발 방지

→ [LESSON-0002](../lessons/LESSON-0002-damage-via-shieldsystem.md): 새 무기는 데미지를 반드시 ShieldSystem 경유.

## 변경 로그

- 2026-06-26: 원인(핸들러 복사본 TakeDamage) 확인 후 ShieldSystem.DealDamage로 수정.
