---
title: "FEAT-0008 컴퍼스 애니 마커 → 사운드 이벤트"
tags: [feature, weapon, animation]
---

# FEAT-0008 — 컴퍼스 애니 마커 → 사운드 이벤트

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (2026-07-03) |
| 관련 | [애니메이션](../architecture/systems/presentation/animation-system.md), [무기](../architecture/systems/combat/weapon-system.md) |

## 왜 넣는가 (의도)

애니메이션의 특정 시점(기어 회전·장전 등)에 소리가 딱 맞게 나도록, **애니 KeyframeMarker**로 사운드를 트리거한다.

## 동작 (코드 기준)

### 마커 → 사운드 브릿지
- 사운드는 `Workspace.compass_sound` 폴더(spin/gear/clink/shot/reload_all 등).
- 애니 트랙(Equip·Reload)에서, compass_sound의 **각 사운드 이름으로 `GetMarkerReachedSignal`을 연결**.
- 애니에 심은 **마커 이름 = 사운드 이름**이면 그 시점에 재생 (예: 마커 `reload_all` → `reload_all` 재생). 이름이 없으면 그냥 안 울림(안전).

### 2D / 3D
- **본인(2D)**: 클론을 `SoundService`에 붙여 재생 → **양쪽 이어폰 동일**(파트에 붙이면 3D로 한쪽만 들림).
- **상대(3D)**: 서버가 재장전 시 `Handle.ReloadSound3D`(=reload_all)를 owner 제외 브로드캐스트 → 위치감 재생.

### `end` 마커 = 소리 종료
- Reload 애니가 재생한 소리를 추적하다가, 애니의 **`end` 마커**가 지나면 즉시 `Stop` → 애니보다 소리가 길어도 끝에서 잘림(본인 2D 기준).

## 구현 위치
- `StarterPack.Compass.ClientHandler` — Equip/Reload 트랙 마커 브릿지(`SfxBound` 어트리뷰트로 1회 바인딩).
- `Workspace.compass_sound` — 사운드 뱅크.
- `StarterPack.Compass.Handle.ReloadSound3D` — 서버 3D용(SoundId = reload_all).

## 메모
- 마커는 애니 편집기에서 **사운드 이름과 동일하게** 찍어야 매칭됨.
- 다른 무기에도 같은 패턴 적용 가능(사운드 폴더 + 트랙 브릿지).

## 변경 로그
- 2026-07-03: 마커→사운드 브릿지(Equip/Reload), 2D(SoundService)·서버 3D, `end` 마커 소리 종료. Compass Reload 애니 등록.
