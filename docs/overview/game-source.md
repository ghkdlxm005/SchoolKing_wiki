---
title: 게임 소스 코드 미러 (game-source)
tags: [overview, code]
---

# 게임 소스 코드 미러 (`game-source/`)

게임 "스쿨 킹"의 실제 스크립트를 저장소 루트 **`game-source/`** 에 미러링해 둔다. GitHub에서 코드를 **참조**하고 git으로 **변경 이력**을 본다.

## 왜

- 위키 문서(FEAT/ai-log)는 "무엇을·왜"를 설명하지만, 실제 코드 원본을 옆에 두면 참조·리뷰·diff가 쉽다.
- 코드가 git에 있으면 **누가·언제·무엇을 바꿨는지** 커밋 이력으로 남는다.

## 구조

Roblox 트리를 그대로 미러링한다.

| Roblox 경로 | 파일 |
| --- | --- |
| `ServerScriptService.BotManager` (Script) | `game-source/ServerScriptService/BotManager.server.lua` |
| `StarterPack.Dustpan.ClientHandler` (LocalScript) | `game-source/StarterPack/Dustpan/ClientHandler.client.lua` |
| `ReplicatedStorage.MeleeSystem.MeleeConfig` (ModuleScript) | `game-source/ReplicatedStorage/MeleeSystem/MeleeConfig.lua` |

접미사: `.server.lua`(Script), `.client.lua`(LocalScript), `.lua`(ModuleScript) — Rojo 관례.

## 포함 / 제외

- **포함**: 게임 자체 스크립트 — ServerScriptService, ServerStorage, ReplicatedStorage, StarterGui, StarterPack, StarterPlayer.
- **제외**: 로블록스 기본(PlayerModule/CameraModule), Workspace의 서드파티 에셋 스크립트(맵·아이템 EasyConfiguration 등 1000+개).

## 갱신 규칙

- 코드를 바꾸면 **같은 세션에 `game-source/`의 해당 파일도 갱신**하고, changelog/ai-log에 기록한다.
- 반영은 사용자가 루트 `push.bat`로 커밋/푸시.
- 자세한 개발 워크플로우는 저장소 루트 `CLAUDE.md` 참조.

## 참고

이 폴더는 **참조·이력용 미러**로, 그 자체가 실행되지는 않는다. 실제 개발은 Roblox Studio에서 한다. 전체 자동·양방향 동기화가 필요하면 [Rojo](https://rojo.space) 도입도 고려할 수 있다(별도 설치·프로젝트 구조 필요).
