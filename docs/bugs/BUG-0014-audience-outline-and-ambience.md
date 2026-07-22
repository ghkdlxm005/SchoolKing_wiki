---
title: "BUG-0014 관중 일부에만 윤곽선·함성이 적용됨"
tags: [bug, ui, sound, map]
---

# BUG-0014 — 관중 일부에만 윤곽선·함성이 적용됨

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | medium |
| 관련 시스템 | 적 윤곽선, 관중 사운드 |
| 발견일 | 2026-07-19 |

## 증상

> "관중 쪽 어떤 건 소리가 나고 안 나고 그러고, 윤곽선이 어떤 건 있고 없고 그래."

관중석마다 **적 윤곽선이 뜨는 곳과 안 뜨는 곳**이 갈렸고, **배경 함성도 일부 관중석에서만** 났다.

## 원인

원인은 하나로 묶인다 — **관중이 9개 구역으로 흩어져 있는데, 코드는 그중 일부만 보고 있었다.**

### ① 윤곽선 — `NoOutline` 태그가 5개 구역에만

`EnemyOutline`은 **워크스페이스의 모든 `Humanoid`** 에 윤곽선을 붙이고, 조상에 `NoOutline` 속성이 있을 때만 건너뛴다.

| 구역 | 관중 수 | `NoOutline` |
| --- | --- | --- |
| `audience A` ×2, `B` ×2, `Back` ×1 | 541 | ✔ |
| `Model` 스탠드 ×4 (맵 네 귀퉁이) | **654** | ✗ |
| 낱개 관중 (남쪽 계단식 관람석) | **145** | ✗ |

이전 작업에서 `audience A/B/Back` 세 이름만 제외 처리했기 때문에, **나머지 799명에는 윤곽선과 머리 위 실드바가 그대로 떴다.**

### ② 함성 — `FindFirstChild`는 하나만 반환한다

```lua
local model = workspace:FindFirstChild("audience A")   -- 2개 중 1개만
```

`audience A`와 `audience B`가 **각각 2개씩** 있는데 `FindFirstChild`는 첫 번째만 돌려준다. 그래서 9개 관중석 중 **2곳에서만** 함성이 났다.

## 해결

**① 윤곽선** — 관중 스탠드와 낱개 관중을 전수 탐색해 `NoOutline`을 태그했다. 판별 기준은 두 가지를 모두 만족하는 모델이다.

- `Humanoid`를 포함
- 관중용 스크립트(`Dance` / `LoopJump` / `Health` / `HealthScript v2.0` / `RobloxTeam` / `Animate`)만 있고 그 외 스크립트가 없음

낱개는 관람석 구역(고지대) 좌표 범위로 한정해 필드의 테스트 더미가 섞이지 않게 했다. 결과: **윤곽선 대상 비플레이어 휴머노이드 0명.**

**② 함성** — 같은 이름의 관중석을 **전부 수집**하도록 변경했다.

```lua
for _, model in ipairs(workspace:GetChildren()) do
    if model:IsA("Model") and model.Name == modelName then
        ... 방출용 파트 생성 ...
    end
end
```

## 후속

맵 작업자가 낱개 관중 145명을 `Model` 하나로 묶으면서 **새 그룹에 `NoOutline`이 없어 증상이 재발**했다. 태그를 다시 적용했다.

> 맵 구조가 바뀌면 태그가 유실된다. 그룹핑이 확정되면 **관중 전용 폴더 하나로 모으고 그 폴더에만 태그**하는 방식이 안전하다.

## 재발 방지

→ [LESSON-0005](../lessons/LESSON-0005-silent-failure.md)

- 이름으로 찾을 때 **동명 인스턴스가 여럿일 수 있다**고 가정한다.
- 제외 목록을 **이름으로 하드코딩하지 않는다**. 특성(스크립트 구성·좌표)으로 판별하면 맵이 바뀌어도 견딘다.

## 구현 위치

- `StarterPlayer.StarterPlayerScripts.EnemyOutline` — `NoOutline` 조상 검사 (코드 변경 없음, 맵 태그로 해결)
- `StarterPlayer.StarterPlayerScripts.OverheadShield` — 동일 기준 사용
- `ServerScriptService.CrowdAmbience` — `makeEmitters` 전수 수집

## 변경 로그

- 2026-07-19: 관중 799명 `NoOutline` 태그, `CrowdAmbience` 전수 수집으로 수정.
- 2026-07-19: 맵 그룹핑 후 신규 그룹(143명) 재태그.
