---
title: "BUG-0025 시차 PLAY 참가자 스폰 누락"
tags: [bug, system]
---

# BUG-0025 — 시차 PLAY 참가자 스폰 누락

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2인 라이브 재검증 필요) |
| 심각도 | high |
| 관련 시스템 | 매치 스폰(CapturePointSystem) / 로컬 폴백 매칭 |
| 발견일 | 2026-08-04 |

## 증상

팀 테스트에서 2명이 있을 때, **시차를 두고 PLAY**를 누르면 뒤늦게 참가한 쪽이 엉뚱한 곳에서 스폰되거나 제대로 스폰되지 않았다.

## 원인

로컬(스튜디오) 폴백 매칭은 스폰을 전적으로 CapturePointSystem의 **라운드 시작 시 일괄 스폰(scatterPlayers)** 에 의존했다. scatter는 그 시점에 `InLobby=false`인 플레이어만 배치하므로, 라운드가 이미 시작된 뒤(또는 scatter 배정 직후)에 PLAY를 누른 참가자는 배치에서 누락됐다.

## 조치

CapturePointSystem에 **진행 중 참가자 보장 스폰**을 추가.

- `InLobby=false`로 바뀌었지만 아직 한 번도 스폰되지 않은(미스폰) 플레이어를 추적(`pendingSpawn`).
- 라운드가 진행 중(playing/starting)이고 일괄 스폰(scatter) 중이 아니면, 미스폰 플레이어를 **아레나 스폰 지점에 즉시 배치**(LoadCharacter + 스폰 지점 PivotTo).
- 사망 후 리스폰은 기존 `DeathRespawnSystem` 소관이므로 대상에서 제외(미스폰 상태만).
- 초기 `Phase`를 `playing`→`lobby`로 바꿔 첫 라운드 시작 전 오작동/이중 스폰 방지.

## 결과

Studio 단일 검증: PLAY(InLobby=false) 시 아레나 스폰 지점(예: -247,4,-235)에 정상 배치. **팀 테스트 2인 시차 PLAY 라이브 재검증 권장.**

## 구현 위치

- `ServerScriptService.CapturePointSystem` — `pendingSpawn` 추적 + 보장 스폰 루프 + 초기 Phase

## 관련

- [BUG-0019](./BUG-0019-teamtest-menu-bypass.md) · [BUG-0020](./BUG-0020-matchmaking-fragmentation.md)

## 변경 로그

- 2026-08-04: 진행 중 참가자 아레나 보장 스폰 + 초기 Phase lobby.
