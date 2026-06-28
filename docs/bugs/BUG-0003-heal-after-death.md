---
title: "BUG-0003 사망과 동시에 힐 입력 시 힐 실행"
tags: [bug, system]
---

# BUG-0003 — 사망과 동시에 힐 입력 시 힐이 실행됨

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-06-26) |
| 심각도 | medium |
| 관련 시스템 | [전투/데미지](../architecture/systems/combat/combat-damage-system.md) (힐) |
| 발견일 | 2026-06-26 |

## 증상

죽는 순간에 힐 키가 들어오면, 이미 사망 중인데도 힐 로직이 시작됐다.

## 원인

`HealController.startHeal()` 진입부에 사망 검사가 없었다.

## 해결

`startHeal()` 시작에 **사망 가드** 추가:
휴머노이드 없음 / `Health <= 0` / 상태가 `Enum.HumanoidStateType.Dead` 이면 즉시 return.

```lua
if (not _h) or _h.Health <= 0 or _h:GetState() == Enum.HumanoidStateType.Dead then return end
```

## 변경 로그

- 2026-06-26: startHeal 사망 가드 추가.
