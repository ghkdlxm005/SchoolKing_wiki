---
title: "FEAT-0010 총기 수직 반동"
tags: [feature, weapon]
---

# FEAT-0010 — 총기 수직 반동

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 (2026-07-12) |
| 관련 | [무기](../architecture/systems/combat/weapon-system.md), 카메라(CustomFPCamera) |

## 왜 넣는가 (의도)

발사 시 반동을 줘서 연사 제어 요소를 만든다. 단, **카메라 흔들림(킥 후 복귀)** 방식은 멀미가 심해서, **조준 자체가 위로 올라가는(=마우스가 밀리는)** 방식으로 간다.

## 동작 (코드 기준)

- **수직 전용**: 발사마다 위쪽 kick(`RecoilVertical`)을 **실제 조준 pitch에 그대로 누적**. 좌우 반동은 사용하지 않음.
- **회복 없음**: 누적된 pitch는 되돌아오지 않음 → 화면이 튕겼다 돌아오는 흔들림이 아니라 **조준점이 계속 위로 올라감**(직접 내려서 제어).
- **연사 증가(progressive)**: 연속 사격 시 `RecoilProgressive`만큼 발당 추가(스트릭 최대 `RecoilProgressiveMax`), 발사 멈추면(`RecoilStreakResetTime`) 리셋.
- **조준 시 감소**: ADS 중이면 `AimRecoilMultiplier`로 완화.
- 전체 세기는 GunConfig 무기별 값의 **30%**로 튜닝(과하다는 피드백 반영).

## 흐름

1. 무기 발사부(`FireEvent:FireServer`) 직후 `Recoil.Fire(config)` 호출.
2. `Recoil`이 kick을 `pending`에 누적.
3. `CustomFPCamera`가 매 프레임 `Recoil.ConsumePitch()`로 가져와 **look pitch에 더함**(그래서 탄도에도 반영).

## 구현 위치

- `ReplicatedStorage.GunSystem.Recoil` (신규 ModuleScript, 클라 싱글턴).
- `StarterPlayer.StarterPlayerScripts.CustomFPCamera` — `pitch = pitch + Recoil.ConsumePitch()`.
- 각 무기 ClientHandler(Compass·Toaster·SiliconGun·LegCrutch) — 발사 시 `Recoil.Fire(config)`.
- `ReplicatedStorage.GunSystem.GunConfig` — 무기별 `RecoilVertical/Progressive/RecoverSpeed/AimRecoilMultiplier`.

## 메모

- "실제 반동"(조준 이동) 방식이라 화면 흔들림 없음. 세기는 GunConfig에서 조절.

## 변경 로그

- 2026-07-12: 수직 반동 도입(조준 pitch 누적·회복 없음·ADS 감소), 세기 30%로 조정.
