---
title: "FEAT-0023 크로스 서버 매칭 시스템"
tags: [feature, system]
---

# FEAT-0023 — 크로스 서버 매칭 시스템

| 항목 | 값 |
| --- | --- |
| 상태 | **예약 서버 격리 매칭으로 복귀(2026-08-15)** — 동시 다수 독립 매치 필요. 수락 시차 버그 수정 |
| 관련 시스템 | 메인 메뉴([FEAT-0022](./FEAT-0022-main-menu-lobby.md)), 거점 점령전([FEAT-0005](./FEAT-0005-capture-point.md)) |
| 통신 | `PlaySpawnRequest`, `MatchmakingStateEvent`, `CancelMatchmakingEvent`, `MatchFlowEvent`, `LobbyStateEvent` |
| 구현 위치 | `ReplicatedStorage.MatchmakingConfig`, `ServerScriptService.MatchmakingService`, `ServerScriptService.LobbySystem` |
| 날짜 | 2026-08-03 |

## 현재 모드 — 예약 서버 격리 매칭 (2026-08-15 복귀)

인서버 라운드제(아래)로 잠깐 전환했으나, **"A팀이 플레이 중에도 다른 플레이어가 동시에 독립 매치에 진입"** 요구를 한 서버(아레나 1개)로는 못 채워서 **예약 서버 격리 방식으로 복귀**했다. 매치마다 예약 서버를 띄워 물리적으로 격리 → 난입 원천 차단, 빈 예약 서버는 자동 폐쇄(AI만 남는 판 없음), 리뷰 item 1·2·8 해결.

- **dispatch**: `if isReserved then runMatchServer() elseif USE_MM then runLobbyMatchmaking() else runLocalFallback()` (복원). `runInServer`(인서버)는 정의만 남기고 비활성.
- **수락 시차 갇힘 버그 수정(핵심)**: 텔포 실패 시 서버가 `cancelled`를 보내는데 클라 `cancelled` 처리가 **loadGui(로딩 로고)를 안 꺼서** 22초 워치독 전까지 갇혔음 → 클라 `cancelled`에서 loadGui 강제 off + 안내. 또한 인서버용으로 넣었던 `found` 처리(로비 캐릭터 있으면 0.6초 뒤 로딩 끔)가 크로스서버엔 잘못이라 제거.
- **봇 채움**: 예약 서버에서 플레이어 도착(InLobby=false) → 거점 시스템 Phase="starting" → `BotManager.ensureBots()`가 부족분 채움.
- 방어: `TeleportAsync` 3회 재시도 + 클라 22초 로딩 타임아웃 + 수락 18초 anti-stuck + `[MM DEBUG]`/`[MM-SRV]` 계측(실기 진단, 서버 로그도 클라 오버레이로 전송).

### 추가 안정화 (2026-08-15, 실전 리뷰 반영)

- **매치 후 재-PLAY 안 잡힘**: 리더 로비 서버가 대기 인원을 pending에 담은 채 비어서 종료되면 그 큐 항목이 유실 → 영영 검색만. 수정: (1) **빈 서버는 리더 안 됨**(`#Players==0`이면 리더 선출 스킵), (2) 배정 없이 **25초+ 대기하면 큐 자동 재등록(셀프힐)**, (3) 매치 성립을 **유니크 userId 수** 기준으로 + 배치 중복 제거. 클라도 검색 90초+ 시 자동 리셋.
- **2번째 플레이어 스폰 실패(죽음 화면 갇힘)**: 예약 서버에 뒤늦게 도착한 참가자가 `InLobby=false` 변경을 스폰 추적이 레이스로 놓쳐 영영 미스폰 → `CapturePointSystem` 늦은 스폰 루프가 **플래그를 놓쳐도 캐릭터 없는 참가자를 무조건 스폰**, 스폰은 봇/플레이어에서 가장 먼 곳, 재진입 가드.
- **첫 입장자 레디 버튼 안 뜸**: 클라 HUD 초기화 레이스로 `LoadoutStartEvent`를 놓침 → `LoadoutSystem.runLoadoutPhase`가 초기 5초간 미준비자에게 재전송 + 늦은 참가자 추가.
- **봇 수·자리**: 봇 채움을 플레이어 스폰 완료 후로 미뤄 `MaxTotal−플레이어`만큼만(2명이면 봇2) + 플레이어 자리 안 뺏게.

### (구) 인서버 라운드제 — 비활성

수락 시차 버그가 크로스서버 텔레포트의 비동기 실패에서 반복되어, 한때 **인서버 라운드제로 전환**했다. 로블록스 기본 서버 분배가 매칭을 대신하고, **한 서버 = 한 매치**로 라운드를 돈다. 텔레포트가 없어 시차 버그가 사라지지만 **동시 다수 독립 매치가 불가**(아레나 1개)라 복귀함. `runInServer` 함수는 보존.

- **흐름**: PLAY → `MatchmakingStateEvent{state="accept"}`(레디 프롬프트, 텔레포트 없음) → `MatchAcceptEvent` 수락 → `InLobby=false` → 거점 시스템이 스폰. **개인 레디 → 즉시 합류**(진행 중 라운드면 바로 합류).
- **봇 자동 채움**: `ReplicatedStorage.MatchState.Phase="starting"` 시 `BotManager.ensureBots()`가 `MaxTotal−플레이어` 만큼 충원(기존엔 Tab 수동만 있었음).
- **로딩 로고**: 텔레포트가 없어, `found` 후 로고는 **아레나 캐릭터 스폰 시** 꺼짐(`MainMenuController`, `CharacterAdded`) + 라운드 countdown + 22초 워치독.
- **구현**: `MatchmakingService.runInServer()`. dispatch가 `runInServer()`만 호출하고, 크로스서버 dispatch(`isReserved`/`USE_MM`/`runLocalFallback`)와 `runMatchServer`/`runLobbyMatchmaking`은 **삭제하지 않고 주석 비활성**(되살리려면 주석 복원).
- **트레이드오프**: 파티(친구 강제 동일 매치)·저동접 플레이어 집중 통제력 상실. 대신 안정성↑, Studio 단일/2인 로컬 재현 가능. 유저·경쟁요소 늘면 매칭 재활성으로 복귀.

아래 크로스서버 설명은 **보존된(비활성) 구조**의 참고 문서다.

## 왜 넣는가 (의도) — 크로스서버(비활성)

로비에서 대기하다 PLAY를 누르면, 흩어진 플레이어를 모아 한 매치 서버에 함께 넣는다. 같은 플레이스가 로비(퍼블릭 서버)와 매치(예약 서버) 두 역할을 겸한다.

## 서버 역할 판별

- **예약(매치) 서버**: `game.PrivateServerId ~= "" and game.PrivateServerOwnerId == 0 and not RunService:IsStudio()`
- 그 외는 **퍼블릭(로비) 서버**. Studio(솔로·팀 테스트)는 항상 로비 + 로컬 폴백.

## 로비 서버 — 매칭

1. PLAY → `PlaySpawnRequest` → MemoryStore **큐**(`MemoryStoreQueue`)에 `{userId, enqueueTime}` 등록. 클라에 `searching` 통지.
2. **단일 리더**가 매치를 구성한다(파편화 방지 — [BUG-0020](../bugs/BUG-0020-matchmaking-fragmentation.md)). `MemoryStoreSortedMap.UpdateAsync` 락(TTL)으로 리더 선출/갱신.
3. 리더가 큐를 읽어 **즉시 제거**하고 pending 풀에 누적. `MIN_PLAYERS` 이상이거나 최고령 대기자가 `WAIT_TIME`을 넘으면 `TeleportService:ReserveServer`로 서버 1개 예약, 배정 SortedMap에 `userId → accessCode` 기록.
4. 각 로비 서버는 배정 맵을 폴링해 자기 플레이어에게 코드가 오면 **수락 프롬프트**(`state="accept"`) → 수락 시 `TeleportAsync`(ReservedServerAccessCode)로 이동(실패 시 3회 재시도, 최종 실패 시 `cancelled`). 취소·미수락 플레이어는 배정을 폐기하고 로비 잔류.

## 예약 서버 — 매치 진행

- 도착한 플레이어는 `InLobby=false`로 표시 → **거점 시스템이 스폰 + 3-2-1 카운트다운을 단일 담당**(이중 스폰 방지, [BUG-0019](../bugs/BUG-0019-teamtest-menu-bypass.md)).
- 부족 인원은 봇으로 채움 — `BotManager`가 `MatchState.Phase="starting"`을 감지해(플레이어 스폰 완료 후) `ensureBots()`로 `MaxTotal−플레이어`만큼 충원. (구 `MatchFillBots`/`SpawnFillBots` 신호는 미연동, Phase 훅으로 대체.)
- 매치 종료(`ServerStorage.MatchEnded`) 또는 안전 최대 시간 초과 시 전원 퍼블릭 로비로 복귀(`TeleportAsync`).

## Studio 폴백

Studio에서는 텔레포트/MemoryStore가 동작하지 않으므로, PLAY 시 그 자리에서 단일 서버 매치로 진행(로컬 폴백). 메뉴→카운트다운 흐름 테스트 가능.

## 설정값 (`MatchmakingConfig`)

| 키 | 값 | 의미 |
| --- | --- | --- |
| MIN_PLAYERS | 2 | 이 인원이면 즉시 매치 |
| MAX_PLAYERS | 8 | 한 매치 최대 |
| WAIT_TIME | 20 | 미달이어도 이 시간 후 봇 채워 시작(초) |
| POLL_INTERVAL | 3 | 매치메이커/배정 폴링(초) |
| LEADER_TTL | 12 | 매치메이커 리더 락 TTL(초) |

## 라이브 요구사항

- 게임 **게시(Publish)** 필수 — `ReserveServer`/`TeleportService`/`MemoryStore`는 Play Solo/Studio에서 미동작.
- Studio 테스트 시 MemoryStore 접근은 **API Services 접근 허용** 필요.

## 알려진 이슈 / 안정화 (2026-08-10)

게시 서버 2인 테스트에서 발견·대응(크로스서버는 게시 전용 → Studio 검증 불가, 2인 실기 재검증 권장):

- **재PLAY 먹통**: 매치 종료·로비 복귀 후 PLAY가 안 먹힘. 로컬 폴백의 `busy` 플래그가 미리셋된 것이 원인(Studio 재현·수정 — 로비 복귀 시 해제). 게시 경로는 잔여 배정 코드 제거로 방어.
- **수락 화면 박제**: accept를 시차로 누르면 갇힘. 서버=텔레포트 실패 시 취소 알림, 클라=수락 후 18초 무응답 시 자동 해제.
- **수락 시차 → 뒤 사람 로딩 갇힘(2026-08-13 추가 수정)**: 위 18초 워치독은 `acceptGui`가 켜져 있을 때만 동작 → "found"로 넘어가 로딩 로고가 뜬 뒤 텔레포트가 **비동기 실패**하면(시차·두 번째 텔레포트에서 잦음) 로딩이 안 꺼지고 갇힘. 근본 원인은 클라의 **`TeleportInitFailed` 핸들러 부재**. → 클라에 텔레포트 실패 핸들러 + 로딩 22초 타임아웃 워치독(로비 복귀·재PLAY) 추가, 서버는 `TeleportToPrivateServer`→`TeleportAsync`(ReservedServerAccessCode) 교체 + `TeleportInitFailed` 3회 재시도·최종 실패 시 취소 통지.
- **죽은 서버 재텔레포트 방지**: PLAY 시 이전 매치의 assign 코드·수락상태 정리.
- **UI 하드 리셋**: 로비 복귀 시 searching·매칭UI·로딩·수락·DeathScreen 강제 리셋.
- **늦은 조인 스폰 보장**: 예약 서버에 시차로 늦게 도착한 참가자가 캐릭터 없으면 직접 LoadCharacter(죽은 화면 갇힘 방지).

## 변경 로그

- 2026-08-15(오후): **예약 서버 격리로 복귀 + 실전 리뷰 안정화** — 인서버 라운드제는 동시 다수 독립 매치 불가라 예약 서버 격리로 복귀(dispatch 복원). 수락 시차 갇힘(클라 `cancelled`가 로딩 로고 안 끔) 수정, 매치 후 재-PLAY 안 잡힘(리더 pending 유실) → 빈서버 리더 제외·큐 셀프힐 재등록·유니크 인원 기준, 2번째 플레이어 스폰 실패(InLobby 레이스) → 캐릭터 없는 참가자 무조건 스폰, 첫 입장자 레디버튼 미표시 → `LoadoutStartEvent` 재전송, 봇 수/자리 → 플레이어 스폰 후 채움. 게시본 실기 재검증 필요.
- 2026-08-15: **인서버 라운드제로 전환** — 반복되는 수락 시차 버그(크로스서버 텔레포트 비동기 실패)를 구조적으로 제거. `MatchmakingService.runInServer()`(PLAY→레디→수락→`InLobby=false` 즉시 합류) 신규, dispatch를 인서버로 교체, 크로스서버 코드(`runMatchServer`/`runLobbyMatchmaking`/원 dispatch)는 주석 비활성·보존. `BotManager`에 `Phase=starting` 시 `ensureBots()` 자동 채움 추가. `MainMenuController`는 아레나 스폰 시 로딩 로고 끔. Play 검증: 참가 시 Phase 전이 + 봇 자동 스폰 OK, 버튼 클릭 체인은 실기/2인 로컬 최종 확인 권장(이제 단일 서버 재현 가능). 진단용 `[MM DEBUG]` 오버레이는 안정화 후 제거 예정.
- 2026-08-15: **수락 시차 버그 미해결 확인**(2인 실기) — 08-13 수정(TeleportInitFailed 복구·재시도)으로도 뒤 사람이 갇힘. 크로스서버라 Studio 재현 불가 → **진단 계측 추가**: 클라 좌하단 `[MM DEBUG]` 오버레이(상태 전이·accept 클릭·TeleportInitFailed 타임스탬프 표시), 서버 `[MM-SRV]` 프린트(F9 서버 로그). 뒤 사람이 멈춘 화면의 마지막 디버그 줄로 정지 지점 특정 예정(accept 클릭 후 found 안 옴=서버 수락 미등록 / found 후 정지=텔레포트 무응답 / TeleportInitFailed=텔포 실패). 안정화 후 계측 제거.
- 2026-08-13: 수락 시차 → 뒤 사람 로딩 갇힘 추가 수정(클라 `TeleportInitFailed` 핸들러 + 로딩 타임아웃, 서버 `TeleportAsync` 재시도 3회). 2인 실기 재검증 필요. (→ 08-15 미해결 확인)
- 2026-08-10: 안정화 6건 — 재PLAY 먹통·수락 박제·잔여배정 정리·UI 리셋·늦은조인 스폰·점수판 정렬(→[FEAT-0027](./FEAT-0027-ai-bot-system.md) 무관, CapturePointSystem).
- 2026-08-03: 크로스 서버 매칭 최초 구현(큐·리더 선출·예약·배정·복귀), Studio 로컬 폴백, 메뉴 FINDING/CANCEL UI 연동.
