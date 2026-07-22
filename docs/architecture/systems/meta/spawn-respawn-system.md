---
sidebar_position: 1
title: 스폰 / 리스폰 시스템 (Spawn & Respawn)
tags: [system, spawn]
---

# 스폰 / 리스폰 시스템

## 책임

최초 스폰, 사망 후 리스폰, 스폰 무적, 리스폰 시 자원 복구.

## 현재 구현 (코드 기준 · 2026-07-12)

| 항목 | 값 / 동작 |
| --- | --- |
| 리스폰 대기 | `Players.RespawnTime = 3`초 |
| 스폰 위치 | SpawnLocation 4개 중 랜덤 (전부 `Duration = 0`) |
| 스폰 반짝이 | **없음** — ForceField 미생성 + 스폰 즉시 제거 |
| 무적 | **5초** (`Character:SetAttribute("Invincible", true)`) — 무적 중에도 **공격 가능** |
| 체력 / 쉴드 | 최대치로 복구 (HP 100 / Shield 100) |
| 회복 아이템 | 쉴드템(책) **3개**로 재충전 (최대 소지 5) |
| 킬러 투시 | 나를 죽인 상대를 **2.5초** 빨간 외곽선으로 노출 |

### 무적 처리 방식

- 스폰 즉시(`onChar` 진입 첫 줄) `Invincible` 속성을 켠다 → `ShieldSystem.DealDamage`가 이 속성을 보고 **데미지를 전부 차단**.
- 엔진 기본 무적(ForceField)은 쓰지 않는다. 반짝이 이펙트가 붙고, 지속시간이 SpawnLocation `Duration`에 묶여 우리 무적 규칙을 덮어쓰기 때문. → [BUG-0005](../../../bugs/BUG-0005-respawn-forcefield-sparkle.md)

```lua
char:SetAttribute("Invincible", true)          -- 스폰 순간 즉시
for _, d in ipairs(char:GetChildren()) do      -- 엔진 반짝이 제거
    if d:IsA("ForceField") then d:Destroy() end
end
task.delay(5, function() char:SetAttribute("Invincible", false) end)
```

## 사망 시

- 남은 쉴드템(책)이 바닥에 드롭 → 아무나 주우면 +1 (킬 시 상대 자원 탈취).
- 리스폰 사운드(TryAgain)는 사망 지점에서 3D 재생, 본인은 낮은 볼륨.

## 구현 위치

- `ServerScriptService.ShieldSystem` — 무적·ForceField 제거·쉴드 복구·킬러 기록.
- `ServerScriptService.HealHandler` — 리스폰 시 책 3개 재충전, 사망 시 드롭.
- `StarterPlayer.StarterPlayerScripts.KillerReveal` — 킬러 2.5초 투시.

## 주의

무적 타이밍 관련 이력 → [BUG-0001](../../../bugs/BUG-0001-spawn-invincibility-timing.md), [BUG-0005](../../../bugs/BUG-0005-respawn-forcefield-sparkle.md)

#system #spawn

## 라운드 시작 배치 (2026-07-19)

라운드가 끝나면 **캐릭터를 새로 생성**한다(`p:LoadCharacter()`). 위치만 옮기지 않는 이유는, 부활 경로를 그대로 타야 상태가 빠짐없이 초기화되기 때문이다.

| 초기화 항목 | 담당 |
| --- | --- |
| 체력 · 쉴드 | `ShieldSystem` 캐릭터 생성 훅 |
| 회복 아이템(책 3개) | `HealHandler` 캐릭터 생성 훅 |
| 탄창 · 예비탄 | StarterPack 도구 재복제 |
| 이동 버프(`SpeedBonus`) | 새 캐릭터라 속성 소멸 |

배치는 스폰 지점을 셔플해 1인 1지점(A/B/C/D)으로 나누고, 스폰 지점이 바라보는 방향을 유지한다.

:::warning SpawnDistributor와의 충돌
`SpawnDistributor`는 `CharacterAdded`에 걸려 있어, 라운드 시작에도 자기 기준으로 다시 배치하려 든다. `MatchState.Phase == "starting"` 동안에는 건너뛰도록 가드가 들어가 있다. 라운드 배치 로직을 손볼 때 이 가드를 확인할 것.
:::

→ [BUG-0009](../../../bugs/BUG-0009-spawn-orientation-reset.md), [BUG-0012](../../../bugs/BUG-0012-viewmodel-left-behind.md)
