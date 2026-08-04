---
title: "BUG-0020 매칭 파편화 (각자 다른 방 배정)"
tags: [bug, system]
---

# BUG-0020 — 매칭 파편화 (각자 다른 방 배정)

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (라이브 재검증 필요) |
| 심각도 | high |
| 관련 시스템 | 크로스 서버 매칭([FEAT-0023](../features/FEAT-0023-matchmaking.md)) |
| 발견일 | 2026-08-03 |

## 증상

두 플레이어가 거의 동시에 PLAY를 눌렀는데 매칭이 잡히지 않고, **각자 다른 빈 방(1인)** 으로 배정됐다. 방 안에는 상대도 없고 아무것도 없었다.

## 원인

각 로비 서버가 **제각기 매치메이커**를 돌렸다. `MemoryStoreQueue:ReadAsync`는 읽은 아이템을 invisibility 동안 다른 리더에게 숨기므로, 두 플레이어가 서버/폴마다 **1명씩 나뉘어** 잡혔다. `MIN_PLAYERS=2`를 한 번에 못 채운 채 각자 `WAIT_TIME`을 넘겨 **1인용 예약 서버가 각각** 생성됐다.

## 조치

**단일 리더 + 누적 풀** 구조로 교체.

- `MemoryStoreSortedMap:UpdateAsync` 락(`LEADER_TTL`)으로 리더 1명만 선출/갱신. 리더가 아니면 매치 구성을 건너뛴다.
- 리더는 큐를 읽어 **즉시 제거**하고 in-memory `pending` 풀에 누적. `MIN_PLAYERS` 이상이거나 최고령 대기자가 `WAIT_TIME` 초과 시, pending에서 최대 `MAX_PLAYERS`를 뽑아 **한 예약 서버에 함께 배정**.
- 예약 실패 시 뽑았던 인원을 pending으로 되돌려 재시도.

## 결과

리더 1명만 매치를 구성하므로 동시 대기자가 같은 방으로 모인다. **라이브(게시본) 실기 재검증 필요.** 남은 리스크: 리더가 매치 구성 직전에 죽으면 pending의 소수 인원이 유실될 수 있음(매치 형성이 수초 내라 창이 짧음).

## 구현 위치

- `ServerScriptService.MatchmakingService` (매치메이커 루프)
- `ReplicatedStorage.MatchmakingConfig` (`LEADER_TTL`)

## 관련

- [FEAT-0023](../features/FEAT-0023-matchmaking.md)

## 변경 로그

- 2026-08-03: 서버별 매치메이커 → 단일 리더 선출 + pending 누적 풀로 교체.
