---
title: "BUG-0013 컴퍼스 애니 마커 사운드가 한 번도 재생되지 않음"
tags: [bug, sound, weapon]
---

# BUG-0013 — 컴퍼스 애니 마커 사운드가 한 번도 재생되지 않음

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | high |
| 관련 시스템 | 사운드, 무기(컴퍼스) |
| 발견일 | 2026-07-19 |

## 증상

콘솔에 컴퍼스 사운드 로드 실패가 반복 출력됐다.

```
Failed to load sound rbxassetid://95763476304057: Requested asset is archived
Failed to load sound rbxassetid://127624796533079: Requested asset is archived
```

이를 조사하다 더 큰 문제가 드러났다. **애니메이션 마커에 연결된 컴퍼스 사운드 13개가 한 번도 재생된 적이 없었다.** `shot_1`, `reload_all`, `clink`, `gear`, `spin` 전부다.

에러조차 나지 않아 **소리가 원래 그런 줄 알고 넘어가고 있었다.**

## 원인

### ① 폴더 경로가 틀렸다 — 조용한 실패

```lua
local _sfx = workspace:FindFirstChild("compass_sound")   -- nil
if _sfx then
    ... 마커 바인딩 ...
end
```

실제 위치는 **`workspace.SFX.compass_sound`** 인데 워크스페이스 최상위에서 찾고 있었다. `_sfx`가 `nil`이 되고, 바로 아래 `if _sfx then` 가드가 **바인딩 블록 전체를 조용히 건너뛰었다.**

nil 가드가 크래시를 막아준 대신, **기능이 통째로 빠진 사실도 함께 숨겼다.**

### ② 바인딩이 일부 트랙에만 걸려 있었다

마커 바인딩 코드가 `Reload`와 `Equip` 트랙에만 인라인으로 들어 있었다. **발사(`Fire`) 트랙에는 아예 없었다.** 경로를 고쳐도 발사음은 여전히 안 났을 것이다.

### ③ 옛 경로가 남아 있었고, 그 에셋이 죽었다

컴퍼스 사운드는 두 갈래로 갈려 있었다.

| 경로 | 대상 | 상태 |
| --- | --- | --- |
| 애니 마커 → `SFX.compass_sound` (13개) | 본인 2D | 미재생 (①②) |
| `playLocal("Fire")` → `GunSystem.Sounds.Compass.Fire` | 본인 2D | **에셋 보관됨** |
| `ServerHandler.play3D` → `Handle.FireSound3D` / `ReloadSound3D` | 다른 플레이어 3D | **에셋 보관됨** |

콘솔 에러는 아래 두 줄(옛 경로)에서 났다. 혼자 테스트하면 3D 쪽은 들을 일이 없어 **에러만 보이고 소리 차이는 못 느끼는** 상태였다.

## 해결

**애니 마커 단일 경로로 통일**했다.

1. **경로 수정** — `workspace` → `workspace.SFX` (마커 바인딩 2곳)
2. **바인딩을 `playAnim`으로 이동** — `bindSfxMarkers(track)`를 공통 함수로 빼고 재생 직전에 호출. `Fire`를 포함한 **모든 트랙**에 적용되며, 새 애니를 추가해도 자동으로 걸린다.
3. **옛 경로 제거**
   - `playLocal("Fire")` / `playLocal("Reload")` 호출 삭제
   - `ServerHandler`의 3D 브로드캐스트 코드 삭제
   - 죽은 인스턴스 3개 삭제: `Compass.Handle.FireSound3D`, `Compass.Handle.ReloadSound3D`, `RS.GunSystem.Sounds.Compass.Fire`

> **부작용**: 컴퍼스 사운드는 이제 **본인에게만** 들린다. 다른 플레이어용 3D 재생 경로가 없어졌다. 필요해지면 마커 재생을 서버 브로드캐스트로 확장해야 한다.

## 재발 방지

→ [LESSON-0005](../lessons/LESSON-0005-silent-failure.md)

핵심은 **"에러가 없다 = 정상"이 아니라는 것**이다. nil 가드로 감싼 선택적 기능은 실패해도 조용하다.

## 구현 위치

- `StarterPack.Compass.ClientHandler` — `bindSfxMarkers`, `playAnim`
- `StarterPack.Compass.ServerHandler` — 3D 브로드캐스트 제거

## 변경 로그

- 2026-07-19: 경로 수정 + 전 트랙 바인딩 + 옛 경로 제거. 게임 전체 사운드 59개 로드 실패 0건 확인.
