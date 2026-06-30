---
title: "FEAT-0006 힙파이어 정확도 · 다이내믹 크로스헤어 · 스카우터 제거"
tags: [feature, weapon, ui]
---

# FEAT-0006 — 힙파이어 정확도 · 다이내믹 크로스헤어 · 스카우터 제거

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (2026-06-30) |
| 관련 | [무기](../architecture/systems/combat/weapon-system.md), [UI/HUD](../architecture/systems/presentation/ui-hud-system.md) |

## 왜 넣는가 (의도)

힙파이어 = **화면 중앙 고정 에임**. 별도 스코프/스카우터 없이 중앙 크로스헤어로 조준하며, 이동 상태에 따라 정확도가 변하고 크로스헤어가 그걸 그대로 보여준다.

## 동작 (코드 기준)

### 스카우터 제거
- 기존 ADS 시 뜨던 **스카우터 스코프 오버레이 제거**. `GunUIController.setScope`가 오버레이를 띄우지 않고 **중앙 크로스헤어를 항상 표시**.
- `StarterGui.GunUI.ScopeFrame`(스카우터 비주얼) 영구 숨김. 우클릭 줌(FOV)은 유지(화면만 당겨짐, 스코프 비주얼 없음).

### 상태별 탄퍼짐 (실제 탄착)
- 공유 모듈 **`ReplicatedStorage.GunSystem.SpreadState`** — `Mult(char, aiming, config)`:
  - 정지 ×1.0 → 이동 ×1.0~`MoveSpreadMult`(속도 비례) → 공중(점프/낙하) ×`AirSpreadMult`
  - ADS면 `AimSpreadMultiplier`로 좁혀짐 + 이동 페널티 완화(×0.4)
- 각 무기 `applySpread`가 `config.Spread × SpreadState.Mult(...)` 사용 → 실제 탄이 상태에 따라 퍼진다.

### 다이내믹 크로스헤어
- `GameHUD.CrosshairController`가 **장착 무기의 실제 base Spread × 같은 상태 배율**로 네 갈래 간격을 실시간 조절 + 발사 순간 벌어졌다 회복(fire kick). → 크로스헤어와 실제 탄착이 일치.

### 무기 성격 유지 (자동)
base Spread를 곱하므로 무기별로 자동 차등:

| 무기 | base Spread | 결과 |
| --- | --- | --- |
| 실리콘건(레이저) | 0.0 | 어떤 상태든 거의 안 퍼짐, 크로스헤어 타이트 |
| 토스터(샷건) | 0.05 | 이동 시 크게 벌어짐 |
| 컴퍼스/목발 | 0.012 / 0.006 | 중간 |

## 구현 위치
- `ReplicatedStorage.GunSystem.SpreadState` (ModuleScript, 신규)
- `ReplicatedStorage.GunSystem.GunConfig` — Default에 `MoveSpreadMult=1.8`, `AirSpreadMult=2.6`
- `StarterPack.{Compass,LegCrutch,Toaster,SiliconGun}.ClientHandler` — `applySpread`
- `StarterGui.GameHUD.CrosshairController` — 실제 스프레드 연동
- `StarterGui.GunUI.GunUIController` — 스카우터 제거(setScope)

## 변경 로그
- 2026-06-30: 스카우터 제거(중앙 에임 상시), SpreadState 상태별 탄퍼짐, 다이내믹 크로스헤어(무기 base 연동) 구현.
