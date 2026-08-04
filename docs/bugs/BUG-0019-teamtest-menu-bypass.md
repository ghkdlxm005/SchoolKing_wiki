---
title: "BUG-0019 팀 테스트 · 후속 접속자 메뉴 우회"
tags: [bug, system, ui]
---

# BUG-0019 — 팀 테스트 · 후속 접속자 메뉴 우회

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (팀 테스트 재검증 필요) |
| 심각도 | high |
| 관련 시스템 | 로비/매칭([FEAT-0023](../features/FEAT-0023-matchmaking.md)), 메인 메뉴([FEAT-0022](../features/FEAT-0022-main-menu-lobby.md)), 거점([FEAT-0005](../features/FEAT-0005-capture-point.md)) |
| 발견일 | 2026-08-03 |

## 증상

- 팀 테스트로 들어가면 메인 메뉴 없이 **바로 게임에 스폰**됐다.
- 한 단계 좁히면: 서버에 **첫 접속자는 메뉴가 뜨는데, 그 다음 접속자는 바로 게임에 들어갔다.**

## 원인

여러 겹이 겹쳤다.

1. **예약 서버 오판**: Studio 팀 테스트/로컬 서버가 `game.PrivateServerId`를 채워, "예약(매치) 서버" 판별이 참이 되어 매치 진행 로직이 돌았다.
2. **스캐터 레이스**: 거점 `resetMatch()`가 서버 시작 즉시 실행되며, `InLobby` 속성이 세팅되기 전(nil) 플레이어를 매치장에 `LoadCharacter`로 스폰했다. 기존 게이트가 `not InLobby`라 nil을 "참가"로 취급.
3. **자동 스폰 레이스**: `Players.CharacterAutoLoads=false`가 걸리기 전에 자동 스폰될 여지.
4. **후속 접속자 클라 레이스**: 메뉴가 일회성 `LobbyStateEvent`와 접속 순간의 `InLobby` 값에 의존 → 나중에 들어온 클라이언트는 이벤트를 놓치거나 어트리뷰트 미복제(nil)로 메뉴 표시 조건(`InLobby == true`)에 안 걸렸다.

## 조치

- (1) 예약 판별에 `and not RunService:IsStudio()` 추가 → Studio는 항상 로비/로컬 폴백.
- (2) 스폰·카운트다운을 **`InLobby == false`(명시적 참가)에만** 적용. 거점 라운드는 참가 인원이 생길 때까지 대기(`countPlaying` 게이트), 매치 플로우 이벤트도 참가자에게만 전송(`firePlaying`). 스폰/카운트다운은 거점 시스템이 단일 담당(매칭 서비스의 중복 처리 제거).
- (3) 로비 스크립트 최상단에서 `CharacterAutoLoads=false`, 접속 즉시 `InLobby=true`.
- (4) 클라이언트를 "`InLobby ~= false`면 무조건 메뉴 표시 + 접속 후 짧은 재확인 루프"로 변경([LESSON-0010](../lessons/LESSON-0010-late-join-state.md)).

## 결과

- 솔로 Play: 접속 시 `InLobby=true`·캐릭터 없음·메뉴 정상, PLAY 후 스폰+`3-2-1` 정상(검증 완료).
- 후속 접속자도 각자 메뉴를 보고 PLAY로 진입하도록 변경. **팀 테스트(2인) 실기 재검증 필요.**

## 구현 위치

- `ServerScriptService.MatchmakingService`
- `ServerScriptService.LobbySystem`
- `ServerScriptService.CapturePointSystem`
- `StarterPlayerScripts.MainMenuController`

## 관련

- [FEAT-0023](../features/FEAT-0023-matchmaking.md) · [FEAT-0022](../features/FEAT-0022-main-menu-lobby.md) · [BUG-0020](./BUG-0020-matchmaking-fragmentation.md) · [LESSON-0010](../lessons/LESSON-0010-late-join-state.md)

## 변경 로그

- 2026-08-03: 4겹 원인(예약 오판·스캐터 레이스·자동 스폰·클라 레이스) 각각 대응.
