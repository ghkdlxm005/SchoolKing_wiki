# game-source — 스쿨 킹 게임 코드 미러

Roblox 게임 "스쿨 킹"의 게임 자체 스크립트를 미러링한 폴더다. Roblox 트리를 그대로 반영한다.

- 파일명 접미사: `.server.lua`(Script), `.client.lua`(LocalScript), `.lua`(ModuleScript)
- 포함: ServerScriptService, ServerStorage, ReplicatedStorage, StarterGui, StarterPack, StarterPlayer(게임 스크립트)
- 제외: 로블록스 기본(PlayerModule/CameraModule), Workspace 서드파티 에셋 스크립트

이 폴더는 **참조·변경이력용 미러**다(실행되지 않음). 실제 개발은 Roblox Studio에서 하고, 변경 시 여기에도 반영한다. 자세한 워크플로우는 루트 `CLAUDE.md` 참조.

마지막 내보내기: 세션별로 갱신(각 파일 git 이력 참조).
