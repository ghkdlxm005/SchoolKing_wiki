---
title: "LESSON-0001 서버 권위 타이밍"
tags: [lesson, system, combat]
---

# LESSON-0001 — 타이밍·판정은 서버 권위로

## 규칙

무적·쿨다운·데미지 등 **시간에 민감한 판정은 서버가 단일 진실원**이 된다.
클라이언트 표시는 연출일 뿐, 판정 근거가 되어선 안 된다.

## 왜 (출처)

[BUG-0001 스폰 무적 타이밍](../bugs/BUG-0001-spawn-invincibility-timing.md)에서, 클라/서버 타이밍 불일치가 원인이었다.

## 적용 대상

[전투/데미지](../architecture/systems/combat-damage-system.md), [스폰/리스폰](../architecture/systems/spawn-respawn-system.md), [이벤트 시스템](../architecture/systems/event-system.md).
