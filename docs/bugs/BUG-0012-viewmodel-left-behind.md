---
title: "BUG-0012 라운드 리셋 후 뷰모델이 제자리에 남음"
tags: [bug, weapon, ui]
---

# BUG-0012 — 라운드 리셋 후 뷰모델이 제자리에 남음

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | high |
| 관련 시스템 | 무기 뷰모델, 라운드 흐름 |
| 발견일 | 2026-07-19 |

## 증상

게임이 끝나고 라운드가 리셋될 때, **직전에 들고 있던 1인칭 뷰모델이 그 자리에 그대로 남았다.** 새 캐릭터로 스폰한 뒤에도 이전 위치에 무기가 떠 있었다.

## 원인

무기 `ClientHandler`는 **Tool 안에 들어 있는 LocalScript**다. 뷰모델 정리는 두 시점에만 걸려 있었다.

```lua
tool.Unequipped:Connect(...)      -- 무기를 바꿀 때
diedConn = hum.Died:Connect(onDeath)   -- 죽었을 때
```

라운드 리셋은 `p:LoadCharacter()`로 캐릭터를 **새로 만든다**. 여기서 두 가지가 동시에 어긋났다.

1. **`Died`가 발생하지 않는다.** 캐릭터가 죽은 게 아니라 **파괴**되기 때문이다.
2. **정리할 주체가 사라진다.** 캐릭터가 파괴되면 그 안의 Tool과 `ClientHandler` 스크립트도 함께 삭제된다. 즉 정리 코드를 실행할 스크립트 자체가 없어진다.

뷰모델은 `workspace.CurrentCamera`에 붙어 있고 `HumanoidRootPart.Anchored = true` 상태다. 매 프레임 위치를 갱신하던 스크립트가 사라지면 **마지막 좌표에 그대로 굳는다.** 카메라는 리스폰과 무관하게 유지되므로 계속 화면에 남는다.

> 이 버그는 라운드 리셋을 **위치 이동에서 캐릭터 재생성으로 바꾸면서** 유입됐다. 이전에는 `CharacterAdded`/파괴가 일어나지 않아 드러나지 않았다.

## 해결

정리 시점을 **스크립트가 아직 살아 있는 동안**으로 앞당기고, 안전망을 하나 더 뒀다.

**1. 무기 7종 전부 — `ClientHandler`에 정리 훅 추가**

```lua
do
    local function _cleanupVM() pcall(destroyViewmodel) end
    player.CharacterRemoving:Connect(_cleanupVM)   -- 파괴 직전 (확실)
    script.Destroying:Connect(_cleanupVM)          -- 스크립트 삭제 직전 (보조)
end
```

`CharacterRemoving`은 캐릭터가 사라지기 **전에** 발생하므로 이 시점엔 스크립트가 살아 있다.

**2. `ViewmodelCleanup` (신규 LocalScript) — 안전망**

`StarterPlayerScripts`에 두어 리스폰과 무관하게 유지된다. 캐릭터가 교체될 때 카메라에 남은 주인 없는 뷰모델을 치운다.

- 대상: `*VM_Local` (`CompassVM_Local`, `LegCrutchVM_Local` 등)
- 제외: `Run_Viewmodel_Local` / `Book_Viewmodel_Local` / `Snack_Viewmodel_Local`
  → `HandsController`·`HealController`가 직접 관리하며 캐릭터 수명과 무관하다

## 재발 방지

**Tool 안의 스크립트는 자기 뒷정리를 스스로 보장할 수 없다.** 캐릭터와 함께 삭제되기 때문이다.

| 정리 대상이 있는 곳 | 정리 시점 |
| --- | --- |
| 캐릭터 **안** (Tool, Accessory) | `CharacterRemoving` — 파괴 전에 처리 |
| 캐릭터 **밖** (Camera, PlayerGui) | 캐릭터와 무관하게 사는 스크립트가 관리 |

`Humanoid.Died`만 믿으면 안 된다. `LoadCharacter`·강제 삭제·팀 변경 등은 죽음 없이 캐릭터를 교체한다.

## 구현 위치

- `StarterPack.{Compass,LegCrutch,Cup,CAN,Dustpan,Toaster,SiliconGun}.ClientHandler` — 정리 훅
- `StarterPlayer.StarterPlayerScripts.ViewmodelCleanup` (신규) — 안전망

## 변경 로그

- 2026-07-19: 무기 7종 정리 훅 추가 + `ViewmodelCleanup` 신규.
