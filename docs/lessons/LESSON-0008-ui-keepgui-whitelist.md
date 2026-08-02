---
title: "LESSON-0008 새 UI는 반드시 KEEP_GUI 화이트리스트에 등록한다"
tags: [lesson]
---

# LESSON-0008 — 새 UI는 반드시 KEEP_GUI 화이트리스트에 등록한다

## 규칙

새 `ScreenGui`를 만들면 **같은 커밋에서** `HUDController`의 `KEEP_GUI` 화이트리스트에 이름을 추가한다.

`HUDController`는 시작 시, 그리고 `PlayerGui.ChildAdded` 시점에 화이트리스트에 없는 모든 `ScreenGui`를 `Enabled = false`로 꺼버린다. 등록을 빼먹으면 UI가 코드상 정상 생성되어도 화면에는 뜨지 않는다. 에러도 없다 — 조용히 사라진다(LESSON-0005와 같은 유형).

```lua
-- StarterGui.GameHUD.HUDController
local KEEP_GUI = {
    GameHUD = true,
    ...
    AbilityHUD = true,    -- 새 UI를 만들면 여기에 이름 추가
    HitMarkerGui = true,
}
pg.ChildAdded:Connect(function(c)
    task.wait()
    if c:IsA("ScreenGui") and not KEEP_GUI[c.Name] then
        c.Enabled = false   -- 화이트리스트에 없으면 즉시 꺼짐
    end
end)
```

체크리스트:

1. `ScreenGui`의 `.Name`을 확정한다(코드에서 설정하는 그 문자열 그대로).
2. 그 이름을 `KEEP_GUI`에 `= true`로 추가한다. 키는 `.Name`과 **정확히** 일치해야 한다.
3. 게임 내에서 실제로 표시되는 문자열은 모두 영어로 작성한다(플레이어 노출 UI 규칙).

## 왜 (출처)

- 아이템 능력 연출 `AbilityHUD`를 새로 만들었으나 `KEEP_GUI`에 등록하지 않아, 생성 직후 sweep이 꺼서 배너·외곽 이펙트가 전혀 보이지 않았다.

## 적용 대상

- `PlayerGui`에 새로 생성하는 모든 `ScreenGui`
- 클라이언트 스크립트가 런타임에 만드는 HUD·오버레이·연출 UI
