---
title: "FEAT-0023 크로스 서버 매칭 시스템"
tags: [feature, system]
---

# FEAT-0023 — 크로스 서버 매칭 시스템

| 항목 | 값 |
| --- | --- |
| 상태 | 구현 (라이브 전용 · 재검증 필요) |
| 관련 시스템 | 메인 메뉴([FEAT-0022](./FEAT-0022-main-menu-lobby.md)), 거점 점령전([FEAT-0005](./FEAT-0005-capture-point.md)) |
| 통신 | `PlaySpawnRequest`, `MatchmakingStateEvent`, `CancelMatchmakingEvent`, `MatchFlowEvent`, `LobbyStateEvent` |
| 구현 위치 | `ReplicatedStorage.MatchmakingConfig`, `ServerScriptService.MatchmakingService`, `ServerScriptService.LobbySystem` |
| 날짜 | 2026-08-03 |

## 왜 넣는가 (의도)

로비에서 대기하다 PLAY를 누르면, 흩어진 플레이어를 모아 한 매치 서버에 함께 넣는다. 같은 플레이스가 로비(퍼블릭 서버)와 매치(예약 서버) 두 역할을 겸한다.

## 서버 역할 판별

- **예약(매치) 서버**: `game.PrivateServerId ~= "" and game.PrivateServerOwnerId == 0 and not RunService:IsStudio()`
- 그 외는 **퍼블릭(로비) 서버**. Studio(솔로·팀 테스트)는 항상 로비 + 로컬 폴백.

## 로비 서버 — 매칭

1. PLAY → `PlaySpawnRequest` → MemoryStore **큐**(`MemoryStoreQueue`)에 `{userId, enqueueTime}` 등록. 클라에 `searching` 통지.
2. **단일 리더**가 매치를 구성한다(파편화 방지 — [BUG-0020](../bugs/BUG-0020-matchmaking-fragmentation.md)). `MemoryStoreSortedMap.UpdateAsync` 락(TTL)으로 리더 선출/갱신.
3. 리더가 큐를 읽어 **즉시 제거**하고 pending 풀에 누적. `MIN_PLAYERS` 이상이거나 최고령 대기자가 `WAIT_TIME`을 넘으면 `TeleportService:ReserveServer`로 서버 1개 예약, 배정 SortedMap에 `userId → accessCode` 기록.
4. 각 로비 서버는 배정 맵을 폴링해 자기 플레이어에게 코드가 오면 `TeleportToPrivateServer`로 이동. 취소한 플레이어는 배정을 폐기하고 로비 잔류.

## 예약 서버 — 매치 진행

- 도착한 플레이어는 `InLobby=false`로 표시 → **거점 시스템이 스폰 + 3-2-1 카운트다운을 단일 담당**(이중 스폰 방지, [BUG-0019](../bugs/BUG-0019-teamtest-menu-bypass.md)).
- 부족 인원은 봇 채우기 신호(`workspace.MatchFillBots` 어트리뷰트 + `ServerStorage.SpawnFillBots` BindableEvent) — 기존 AI 봇 스포너 연동은 후속 작업.
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
- **죽은 서버 재텔레포트 방지**: PLAY 시 이전 매치의 assign 코드·수락상태 정리.
- **UI 하드 리셋**: 로비 복귀 시 searching·매칭UI·로딩·수락·DeathScreen 강제 리셋.
- **늦은 조인 스폰 보장**: 예약 서버에 시차로 늦게 도착한 참가자가 캐릭터 없으면 직접 LoadCharacter(죽은 화면 갇힘 방지).

## 변경 로그

- 2026-08-10: 안정화 6건 — 재PLAY 먹통·수락 박제·잔여배정 정리·UI 리셋·늦은조인 스폰·점수판 정렬(→[FEAT-0027](./FEAT-0027-ai-bot-system.md) 무관, CapturePointSystem).
- 2026-08-03: 크로스 서버 매칭 최초 구현(큐·리더 선출·예약·배정·복귀), Studio 로컬 폴백, 메뉴 FINDING/CANCEL UI 연동.
