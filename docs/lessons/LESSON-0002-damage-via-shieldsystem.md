---
title: "LESSON-0002 데미지는 항상 ShieldSystem 경유"
tags: [lesson, combat, weapon]
---

# LESSON-0002 — 데미지는 항상 `ShieldSystem.DealDamage`로

## 규칙

플레이어/NPC에 데미지를 줄 때 **절대 `humanoid:TakeDamage()`를 직접 쓰지 않는다.**
반드시 **`ShieldSystem.DealDamage(humanoid, dmg)`** 를 호출한다 — 그래야 쉴드부터 차감된다.

## 왜 (출처)

[BUG-0002](../bugs/BUG-0002-can-shield-bypass.md): CAN 핸들러가 Cup의 옛 복사본이라 `TakeDamage`를 직접 호출 → 쉴드 무시.

## 적용 대상

새 무기 핸들러를 **기존 핸들러 복사**로 만들 때 특히 주의. 데미지 호출부를 전부 점검.
관련: [전투/데미지 시스템](../architecture/systems/combat-damage-system.md), [구현 방식](../architecture/systems/implementation-conventions.md).
