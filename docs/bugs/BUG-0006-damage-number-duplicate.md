---
title: "BUG-0006 한 발에 데미지 숫자가 여러 개 뜸"
tags: [bug, ui, weapon]
---

# BUG-0006 — 한 발에 데미지 숫자가 여러 개 뜸

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-12) |
| 심각도 | medium |
| 관련 시스템 | 데미지 표기, 무기 |
| 발견일 | 2026-07-12 |

## 증상

한 번 명중했는데 데미지 숫자가 여러 개(예: 3개) 겹쳐 떴다.

## 원인

각 무기 ClientHandler가 각자 `HitFeedbackEvent`를 받아 숫자를 띄웠다. 로드아웃/백팩에 든 무기들의 ClientHandler가 모두 로드·연결돼 있어, 서버가 명중 이벤트를 쏘면 여러 핸들러가 동시에 같은 숫자를 스폰했다(장착 무기 수만큼). 점사·샷건이면 발마다 하나씩 겹쳐 더 심했다.

## 조치

1. 공유 `DamageNumbers` 하나로 통합: 무기별 표시를 제거하고, 하나의 클라 스크립트가 `HitFeedbackEvent`를 단독 처리(히트마커 포함).
2. 합산 표기: 같은 대상에 짧은 시간(0.7초) 내 명중은 우측에 누적 합산, 단일 값은 좌측에 부위별 색(머리 노랑/몸통 흰/팔다리 회색).
3. 투사체 표시: 캔 폭발·컵 파편 데미지도 `HitFeedbackEvent`를 발사(소유자를 던질 때 캡처해 전달)해 숫자 표시 + 벽 투시가 되게 함.

## 결과

한 발당 데미지 숫자가 하나로 표시된다. 투사체 데미지까지 동일 경로로 표기된다.

## 구현 위치

- `StarterPlayer.StarterPlayerScripts.DamageNumbers` (신규 통합).
- 각 무기 ClientHandler — 개별 `spawnDamageNumber`/`showHitMarker` 호출 제거.
- `StarterPack.CAN/Cup.ServerHandler` — 폭발/장판 데미지 시 `HitFeedbackEvent` 발사(owner 전달).

## 변경 로그

- 2026-07-12: 무기별 중복 제거, 공유 DamageNumbers 통합, 합산·부위색 표기, 투사체 데미지 표시.
