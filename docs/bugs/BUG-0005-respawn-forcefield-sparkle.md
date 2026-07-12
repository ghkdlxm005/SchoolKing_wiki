---
title: "BUG-0005 리스폰 반짝이·무적·실드 피해 오작동"
tags: [bug, spawn, system]
---

# BUG-0005 — 리스폰 반짝이·무적·실드 피해가 의도대로 안 됨

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-12) |
| 심각도 | medium |
| 관련 시스템 | 리스폰(ShieldSystem), 스폰 |
| 발견일 | 2026-07-12 |

## 증상

리스폰 개편(반짝이 제거·5초 무적·실드 피해 방지)을 넣었는데 실제로는:

- 리스폰 시 **반짝이(ForceField)가 계속** 나타남.
- 5초 무적이 안 먹는 것처럼 보임.

## 원인

맵에 **SpawnLocation이 4개**인데 그중 **3개가 `Duration=10`** 이었다. 엔진은 Duration>0인 스폰에서 스폰할 때 **ForceField(반짝이)를 자동 생성**한다.

- 반짝이가 계속 생기고,
- 그 엔진 ForceField(10초 완전 무적)가 우리의 5초 무적 시스템을 **덮어**버렸다.

또 `onChar`에서 무적을 `WaitForChild("Humanoid")` **이후**에 켜서, 스폰 직후 짧은 구간에 실드 피해가 들어갈 여지가 있었다.

## 해결

- **모든 SpawnLocation `Duration=0`** + 스폰 즉시 캐릭터의 `ForceField` 파괴(+5초간 추가 생성분도 제거).
- **무적을 `onChar` 맨 앞에서 즉시 설정**(Humanoid 대기 전) → 스폰 순간부터 피해 차단, 5초 후 해제.

## 구현 위치

- `ServerScriptService.ShieldSystem` — `onChar` 무적/ForceField 처리.
- Workspace SpawnLocation들 `Duration=0`.

## 변경 로그

- 2026-07-12: SpawnLocation Duration 0 통일 + ForceField 즉시 제거, 무적 스폰 즉시 적용.
