---
title: "BUG-0009 스폰 시 캐릭터가 반대 방향을 봄"
tags: [bug, spawn]
---

# BUG-0009 — 스폰 시 캐릭터가 반대 방향을 봄

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | medium |
| 관련 시스템 | 스폰/리스폰, 라운드 흐름 |
| 발견일 | 2026-07-19 |

## 증상

맵의 `SpawnLocation`을 전부 원하는 방향으로 맞춰뒀는데, 실제로 스폰하면 캐릭터가 엉뚱한 방향(대체로 반대편)을 보고 있었다. 리스폰과 라운드 시작 배치 양쪽 모두 동일했다.

## 원인

스폰 분산 로직에서 캐릭터를 옮길 때 위치만 지정하고 회전을 버렸다.

```lua
char:PivotTo(CFrame.new(sp.Position + Vector3.new(0, 4, 0)))
```

`CFrame.new(위치)`는 회전이 항등(identity)인 CFrame을 만든다. 월드 −Z를 보는 기본 방향으로 고정된다. `SpawnLocation`에 작성자가 지정해 둔 방향은 전달 경로 자체가 없었다.

로블록스 기본 스폰은 SpawnLocation의 `LookVector` 방향으로 캐릭터를 세우는데, 커스텀 배치 로직이 그 동작을 덮어쓰면서 방향 정보만 유실됐다.

같은 코드가 두 곳에 복제되어 있어 증상도 두 곳에서 나타났다.

- `ServerScriptService.SpawnDistributor` → `placeCharacter`
- `ServerScriptService.CapturePointSystem` → `scatterPlayers`

## 조치

스폰 지점의 `LookVector`를 살려서 배치하도록 두 곳 모두 수정했다.

```lua
-- 스폰 지점이 바라보는 방향 유지 (CFrame.new(위치)만 쓰면 회전 초기화됨)
local _look = sp.CFrame.LookVector
local _flat = Vector3.new(_look.X, 0, _look.Z)
if _flat.Magnitude < 0.01 then _flat = Vector3.new(0, 0, -1) end
local _pos = sp.Position + Vector3.new(0, 4, 0)
char:PivotTo(CFrame.lookAt(_pos, _pos + _flat.Unit))
```

- 수평 성분만 사용해, 스폰 파트가 기울어져 있어도 캐릭터는 똑바로 선다.
- 수평 성분이 0에 수렴하면(스폰이 완전히 수직) `−Z` 기본값으로 폴백.

## 결과

리스폰과 라운드 시작 배치 모두 스폰 지점 방향대로 선다. 재발 방지를 위해 캐릭터를 옮길 때 `CFrame.new(위치)`를 쓰지 않고, 방향이 의미 있는 배치라면 원본 CFrame의 회전을 함께 넘긴다.

| 쓰면 안 되는 것 | 대신 쓸 것 |
| --- | --- |
| `CFrame.new(pos)` | `CFrame.lookAt(pos, pos + 수평LookVector)` |
| | 또는 `sp.CFrame + Vector3.new(0, 4, 0)` (기울기까지 유지해도 될 때) |

같은 배치 로직이 두 파일에 복제되어 있어 한 곳만 고치면 절반만 해결된다. 스폰 배치는 향후 한 곳으로 합치는 것이 좋다.

## 구현 위치

- `ServerScriptService.SpawnDistributor` — 사망 후 리스폰 분산
- `ServerScriptService.CapturePointSystem` — 라운드 시작 시 A/B/C/D 배치

## 변경 로그

- 2026-07-19: 두 곳 모두 스폰 지점 LookVector 유지하도록 수정.
