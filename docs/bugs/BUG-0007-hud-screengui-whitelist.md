---
title: "BUG-0007 새로 만든 HUD가 화면에 안 나옴"
tags: [bug, ui]
---

# BUG-0007 — 새로 만든 HUD(ScoreHUD)가 화면에 안 나옴

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | high |
| 관련 시스템 | [UI/HUD](../architecture/systems/presentation/ui-hud-system.md) |
| 발견일 | 2026-07-19 |

## 증상

새로 추가한 랭킹/점수 HUD(`ScoreHUD`)가 화면에 전혀 표시되지 않았다. 스크립트는 정상 실행되어 `[ScoreHUD] ready` 로그까지 출력됐고, 위치·크기를 여러 번 바꿔도 변화가 없었다.

## 원인

`StarterGui.GameHUD.HUDController`가 "예전 무기 HUD 잔재 숨기기" 목적으로 PlayerGui의 `GameHUD`를 제외한 모든 ScreenGui를 `Enabled = false`로 만들고 있었다. 게다가 `ChildAdded`까지 연결해 이후 새로 추가되는 ScreenGui도 계속 비활성화했다.

```lua
-- 문제의 코드 (수정 전)
for _, c in ipairs(pg:GetChildren()) do
    if c:IsA("ScreenGui") and c.Name ~= "GameHUD" then c.Enabled = false end
end
pg.ChildAdded:Connect(function(c)
    if c:IsA("ScreenGui") and c.Name ~= "GameHUD" then task.wait(); c.Enabled = false end
end)
```

ScoreHUD는 생성되는 족족 꺼졌다. UI 코드 자체는 정상이었다.

### 진단이 오래 걸린 이유

- 서버 데이터모델로 PlayerGui를 조회했을 때 ScoreHUD가 안 보여 "생성 실패"로 오판했다. 클라이언트가 만든 GUI는 서버로 복제되지 않으므로 이 방식으로는 확인할 수 없다.
- 갱신 루프를 `pcall`로 감싸 두어 내부 에러가 있었더라도 조용히 묵살됐다. 진단용 로그가 없으면 "실행은 되는데 안 보임" 상태에서 단서가 끊긴다.

셀 개수·절대좌표를 콘솔에 찍어 `cells=1`, 좌표 정상을 확인하고 나서야 렌더 문제가 아니라 외부에서 비활성화되는 문제로 방향을 좁힐 수 있었다.

## 조치

허용 목록 방식으로 전환. 우리 UI는 보호하고 잔재만 끈다.

```lua
local KEEP_GUI = { GameHUD = true, ScoreHUD = true, Freecam = true }
local function sweep(c)
    if c:IsA("ScreenGui") and not KEEP_GUI[c.Name] then c.Enabled = false end
end
```

## 결과

ScoreHUD가 정상 표시된다. 재발 방지를 위해 다음을 지킨다.

- UI를 추가할 때는 `HUDController`의 `KEEP_GUI`에 이름을 등록한다. 등록하지 않으면 생성 즉시 꺼진다.
- 클라이언트 GUI는 서버에서 조회되지 않으므로 진단은 클라이언트 로그로 한다.
- 주기 실행 루프를 `pcall`로 감쌀 때는 실패를 반드시 warn으로 출력한다.

## 구현 위치

- `StarterGui.GameHUD.HUDController` — ScreenGui 화이트리스트 처리.

## 변경 로그

- 2026-07-19: 화이트리스트(`GameHUD`/`ScoreHUD`/`Freecam`) 적용, 그 외 ScreenGui만 비활성화.
