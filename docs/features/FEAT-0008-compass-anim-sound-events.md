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

애니메이션의 특정 시점(기어 회전·장전 등)에 소리가 딱 맞게 나도록, 애니 KeyframeMarker로 사운드를 트리거한다.

## 동작 (코드 기준)

### 마커 → 사운드 브릿지
- 사운드는 `Workspace.compass_sound` 폴더에 둔다(spin/gear/clink/shot/reload_all 등).
- 애니 트랙(Equip·Reload)에서 compass_sound의 각 사운드 이름으로 `GetMarkerReachedSignal`을 연결한다.
- 애니에 심은 마커 이름이 사운드 이름과 같으면 그 시점에 재생된다(예: 마커 `reload_all`이면 `reload_all` 재생). 이름이 없으면 그냥 안 울린다(안전).

### 2D / 3D
- 본인(2D): 클론을 `SoundService`에 붙여 재생해 양쪽 이어폰에 동일하게 들린다(파트에 붙이면 3D로 한쪽만 들림).
- 상대(3D): 서버가 재장전 시 `Handle.ReloadSound3D`(=reload_all)를 owner 제외하고 브로드캐스트해 위치감 있게 재생한다.

### `end` 마커 = 소리 종료
- Reload 애니가 재생한 소리를 추적하다가, 애니의 `end` 마커가 지나면 즉시 `Stop`한다. 애니보다 소리가 길어도 끝에서 잘린다(본인 2D 기준).

## 구현 위치
- `StarterPack.Compass.ClientHandler` — Equip/Reload 트랙 마커 브릿지(`SfxBound` 어트리뷰트로 1회 바인딩).
- `Workspace.compass_sound` — 사운드 뱅크.
- `StarterPack.Compass.Handle.ReloadSound3D` — 서버 3D용(SoundId = reload_all).

## 메모
- 마커는 애니 편집기에서 사운드 이름과 동일하게 찍어야 매칭된다.
- 다른 무기에도 같은 패턴을 적용할 수 있다(사운드 폴더 + 트랙 브릿지).

## 규칙: 마커 이름 = 사운드 이름 (전 무기 공통)

3인칭/뷰모델 애니에 찍은 KeyframeMarker의 **이름을 `Workspace.SFX.<무기폴더>` 안 사운드 이름과 똑같이** 두면, 그 시점에 해당 사운드가 재생된다. 마커가 없으면 조용히 넘어간다(안전).

- 마커 확인: `KeyframeSequenceProvider:GetKeyframeSequenceAsync(rbxassetid://ID)`로 런타임에서 읽는다(Edit 모드에서 트랙 마커 미노출 시 이 방법). 예) 실리콘 장전 `93584166771428` → `silicon_ready`(0.10s), `silicon_reload_1`(0.33s), `silicon_reload_2`(1.10s).
- 바인딩: 핸들러에서 해당 트랙에 `GetMarkerReachedSignal(사운드명)`을 무기 SFX 폴더의 사운드마다 연결(`SfxBound` 어트리뷰트로 1회).

### 현재 방식 / 자동화(미구현, 규칙만)

- **현재**: 무기별 핸들러에 마커 바인딩 블록을 수동으로 넣는다(Compass·Silicon 등). 트리거(애니 재생)는 있어도 마커→사운드 연결은 자동이 아니다 — 넣어야 소리가 난다.
- **자동화(향후 옵션, 미구현)**: `ThirdPersonAnims.load`에서 각 애니의 마커를 `GetKeyframeSequenceAsync`로 읽어, 마커 이름과 같은 SFX 사운드를 자동 바인딩하면 무기별 코드가 필요 없어진다. 규칙은 "마커명 = 사운드명" 하나로 유지. 지금은 문서로만 남기고 수동 배선을 유지한다.

## 변경 로그
- 2026-07-03: 마커→사운드 브릿지(Equip/Reload), 2D(SoundService)·서버 3D, `end` 마커 소리 종료. Compass Reload 애니 등록.
- 2026-08-02: 실리콘 장전 3인칭 애니(`93584166771428`) 등록 + 마커 3종(silicon_ready/reload_1/reload_2) 바인딩. "마커명=사운드명" 규칙·자동화 방안 문서화(자동화는 미구현).
