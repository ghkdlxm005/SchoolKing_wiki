---
title: "FEAT-0004 SiliconGun 사격 포즈 · 연속사격 부들거림"
tags: [feature, weapon, animation]
---

# FEAT-0004 — SiliconGun 사격 포즈 · 연속사격 부들거림

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (2026-06-28) |
| 관련 시스템 | [무기](../architecture/systems/combat/weapon-system.md), [애니메이션](../architecture/systems/presentation/animation-system.md), [리깅·머즐](../architecture/systems/presentation/viewmodel-rigging.md) |
| 통신 | 없음 (클라이언트 표현 전용) |

## 왜 넣는가 (의도)

레이저를 **오래 연사할수록 총이 버거워지는 느낌**을 주기 위함. 에너지를 쓸수록 포즈가 변하고(스크럽), 계속 누르고 있으면 점점 심하게 떨려서 "과열·반동 누적"을 시각적으로 전달한다. 끊어 쏘면 부담이 리셋된다.

## 동작

### 사격 포즈 애니 (Fire `138179196835705`)

- `GunSystem.Animations.SiliconGun.Fire`에 등록. AnimSettings: **looped, priority=Action3**(틸트 Action2 위에 표시).
- 레이저는 발당(틱) 재생을 끄고, **RenderStep에서 수동 제어**한다(발당 재생과 충돌 방지).

### 탄약비례 포즈 스크럽

- 매 프레임 `TimePosition = (1 − 현재탄/최대탄) × 애니길이` 로 설정, 목표값으로 부드럽게 접근.
- 즉 탄약 100 → 줄어들수록 키프레임이 그만큼 진행. (애니 길이 > 0, 즉 키프레임 2개 이상일 때만 보임)

### 연속사격 부들거림 (램프)

- 좌클릭을 **누르기 시작한 순간**의 탄약을 기준점으로 잡고, 누르는 동안 쏜 발수(`holdStartMag − currentMag`)를 센다.
- 그 발수가 **0 → 50발**로 갈수록 떨림 세기가 **0 → 최대**(선형). 50발 이후 최대 유지.
- **손을 떼면 리셋** → 다시 누르면 처음(약한 떨림)부터. **끊어 쏘면 매번 처음부터.**
- 떨림은 애니가 아니라 **뷰모델 자체를 미세 회전**(다중 sin 합성)시켜 구현 → 1프레임 애니여도 보인다.
- 적용 타이밍: 레이저 RenderStep(`Camera+2`)이 follow 루프(`Camera+1`) **이후**에 돌아 hrp 흔들림이 그 프레임에 유지됨.

### 정지

- 발사를 멈추면 Fire 트랙을 짧게 Stop(0.06s) → **즉시 원위치**.

## 구현 위치

- `StarterPack.SiliconGun.ClientHandler` — `SiliconGunLaser` RenderStep 내 포즈 스크럽 + 떨림 램프.
- `ReplicatedStorage.GunSystem.Animations.SiliconGun.Fire` = `rbxassetid://138179196835705`.

## 튜닝값

| 값 | 의미 | 현재 |
| --- | --- | --- |
| 최대 도달 발수 | 떨림이 최대가 되는 연속 사격량 | 50 |
| `amp` | 최대 떨림 세기(회전 rad) | 0.016 (≈0.9°) |
| 접근 속도 | 포즈 스크럽이 목표로 가는 속도 | `dt × 6` |

## 변경 로그

- 2026-06-28: 사격 포즈 애니 등록, 탄약비례 스크럽, 연속사격 부들거림(0→50발 램프, 손 떼면 리셋) 구현.
