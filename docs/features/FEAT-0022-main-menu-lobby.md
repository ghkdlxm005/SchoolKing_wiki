---
title: "FEAT-0022 메인 메뉴 / 로비"
tags: [feature, ui, system]
---

# FEAT-0022 — 메인 메뉴 / 로비

| 항목 | 값 |
| --- | --- |
| 상태 | 구현 (폴리싱 지속) |
| 관련 시스템 | 로비/매칭([FEAT-0023](./FEAT-0023-matchmaking.md)) |
| 통신 | `LobbyStateEvent`, `PlaySpawnRequest`, `MatchFlowEvent` |
| 구현 위치 | `StarterPlayerScripts.MainMenuController`, `ServerScriptService.LobbySystem` |
| 날짜 | 2026-08-03 |

## 왜 넣는가 (의도)

접속하면 곧장 전장에 떨어지는 대신, 실제 캐릭터가 등장하는 3D 로비 화면에서 대기하다가 PLAY로 매치에 들어가는 흐름을 만든다. 스쿨 킹 브랜드(로고/왕관)를 전면에 세운다.

## 동작

- **3D 씬**: 맵에 배치한 `Start cam` 파트의 CFrame으로 카메라를 고정(Scriptable). `MenuStand` 위에 실제 플레이어 아바타를 세운다.
- **실제 아바타**: `Players:CreateHumanoidModelFromUserId`로 클라이언트 로컬 아바타를 만들어 배치된 `Rig`의 위치·바디 스케일을 복사하고, 원본 `Rig`는 로컬에서 숨긴다. 기본 이모트를 루프 재생.
- **왕관(Crown)**: 캐릭터 머리 위를 매 프레임 따라다니며 호버(사인)+회전. 윤곽선 없음.
- **로고**: 업로드 이미지(`rbxassetid://129936205878235`)를 화면 우상단에 크게.
- **버튼**: PLAY / OPTION / CUSTOMIZE / MENU. 로고 느낌의 Bangers 폰트 + 외곽선, 호버 시 골드.
- **흐름**: PLAY → "FINDING MATCH" 패널 → 매치 확정 시 로고 로딩 화면 → 스폰(로딩으로 가림) → `3-2-1 GAME START`. OPTION = ESC 메뉴, CUSTOMIZE = 무기 레이아웃.
- **HUD 숨김**: 로비 동안 게임 HUD(점수판/킬피드 등)를 끈다. `MatchmakingUI`/`LoadingScreen`/`MainMenu`는 `HUDController.KEEP_GUI` 화이트리스트 등록([LESSON-0008](../lessons/LESSON-0008-ui-keepgui-whitelist.md)).

## 2026-08-03 폴리싱

- 왕관: 윤곽선 제거, 고정 위치 → **캐릭터 머리 추적**, 회전 속도 30% 감소.
- 로고: 50% 확대 후 **우상단**으로 이동.
- PLAY 버튼: 아래로 이동, 글씨를 로고풍(Bangers)으로.
- 좌상단 `ESC` 힌트 라벨 제거.
- "다리 파랑" 조사 결과 **버그 아님**: 실제 아바타 설명서의 `LeftLegColor`(파랑) + 기본 청바지. 메뉴는 실제 아바타를 그대로 렌더링하는 것이라 계정마다 다르게 보인다.

## 변경 로그

- 2026-08-03: 왕관 머리 추적·회전 감속·윤곽선 제거, 로고 확대·우상단, PLAY 하강+로고풍 폰트, 좌상단 ESC 라벨 제거. 다리 파랑=실제 아바타(정상) 확인.
