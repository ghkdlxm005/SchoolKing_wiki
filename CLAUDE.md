# CLAUDE.md — 스쿨 킹(School King) 프로젝트 지침

이 저장소는 **스쿨 킹** Roblox 게임의 **위키(Docusaurus)** + **게임 소스 코드 미러(`game-source/`)** 다.
Claude는 Roblox Studio MCP로 게임을 개발하고, 그 내용을 이 위키/코드 미러에 기록한다.

## 게임 개요

- R15 FPS 거점 점령전. 무기(근접/총기/투척) + AI 봇(CleanUP) + 크로스서버 매칭.
- Roblox Studio MCP(`mcp__Roblox_Studio__execute_luau` 등)로 개발. **`studio_id`는 매 세션 바뀌므로** `list_roblox_studios`로 현재 인스턴스를 확인해 사용.

## 표준 규칙 (반드시 준수)

- **위키 git push 금지** — 변경 파일만 만들고, 사용자가 루트의 `push.bat`(git add -A → commit → push)로 직접 올린다.
- **위키에 이모지 금지.**
- **게임 내 UI 문자열은 영어**로.
- **봇 = 플레이어** — 봇은 플레이어와 동일한 룰·아이템·리깅·애니·사운드·전투를 그대로 탄다. "봇만 유리/불리"는 버그.
- **서버 스크립트 변경은 Play 재시작** 후 반영.
- **무기 문서는 무기당 1파일.**

## 문서 구조 (역할 분리)

- `docs/changelog.md` — **간단한 패치 노트**. 한 항목 = 2~4문장(무엇을/왜 + 핵심 수치). 최신순.
- `docs/ai-log/YYYY-MM-DD.md` — **세부 개발 로그**. 항목별 섹션으로 **증상 → 원인 → 변경위치 → 검증**. `docs/ai-log/index.md` 표에 등록.
- `docs/features/FEAT-####-*.md` — **현재 상태 레퍼런스**(코드 구조·동작). `docs/features/index.md` 표에 등록.
- `docs/bugs/`, `docs/lessons/` — 버그·교훈.
- 큰 변경은 changelog + ai-log + FEAT 세 곳을 함께 갱신하고 서로 링크.

## 코드 미러 워크플로우 (`game-source/`) — ★계속 진행

목적: 게임 코드를 GitHub에 올려 **참조**하고 git으로 **변경 이력**을 본다.

- 위치: 저장소 루트 `game-source/`. Roblox 트리를 미러링한다.
  예) `ServerScriptService.BotManager` → `game-source/ServerScriptService/BotManager.server.lua`
- 파일명 접미사: `Script`=`.server.lua`, `LocalScript`=`.client.lua`, `ModuleScript`=`.lua` (Rojo 관례).
- 포함 대상: **게임 자체 스크립트**(ServerScriptService, ServerStorage, ReplicatedStorage, StarterGui, StarterPack, StarterPlayer). 
- 제외: 로블록스 기본(PlayerModule/CameraModule), Workspace의 서드파티 에셋 스크립트(맵/아이템 EasyConfiguration 등 1000+개).
- **초기 전체 추출**: **Rojo 계열(rbxlx-to-rojo)** 로 place(.rbxlx)를 파일로 변환해 게임 스크립트를 `game-source/`에 채운다. 절차는 `game-source/ROJO_SETUP.md` 참조. (채택 결정: 2026-08-15)
- **이후 변경분 유지**: 개발은 Studio(Claude/MCP)에서 하므로, **코드를 수정하면 Claude가 같은 세션에 `game-source/`의 해당 파일도 갱신**하고 changelog/ai-log에 기록한다. (MCP `.Source` 읽어 파일로 씀. 큰 스크립트는 `:sub()`로 나눠 읽어 이어붙임.) 대규모로 다시 맞추려면 추출을 재실행.
- 사용자는 `push.bat`로 커밋/푸시 → GitHub에서 diff·이력 확인.
- 관련 파일: `game-source/ROJO_SETUP.md`(추출·동기화 가이드), 루트 `default.project.json`(Rojo 매핑, 실시간 동기화 선택 시), `docs/overview/game-source.md`(위키 안내).
- ⚠ `rojo serve`는 **파일→Studio** 방향이라 `game-source/`가 비어 있으면 Studio를 덮어쓴다. 반드시 추출로 먼저 채운 뒤 사용.

## 검증 관례

- 코드 변경은 Play로 격리/실전 검증(스크린샷·수치). Studio 입력 제한(실제 키 입력 불가)으로 못 하는 건 "라이브 검증 필요"로 명시.
- `loadstring()`로 문법 확인 후 `.Source` 반영.
