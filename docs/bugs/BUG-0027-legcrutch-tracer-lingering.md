---
title: "BUG-0027 목발 총알 궤적(트레이서) 잔존"
tags: [bug, weapon, render]
---

# BUG-0027 — 목발 총알 궤적(트레이서) 잔존

| 항목 | 값 |
| --- | --- |
| 상태 | fixed |
| 심각도 | medium |
| 관련 시스템 | 무기 이펙트(WeaponEffectsClient) |
| 발견일 | 2026-08-04 |

## 증상

실리콘건 레이저는 정상인데, **목발(LegCrutch) 발사 시 총알이 날아가는 궤적이 화면에 남아** 보였다(특히 상대·봇 사격이 오래 잔존).

## 원인

트레이서 투사체 연출의 이동 속도가 느리고(`TRACER_SPEED` 300) 비행 시간 상한(`travelTime` clamp 1.5초)이 커서, 히트스캔 명중은 즉시 끝나는데 **연출용 트레이서만 오래 살아 남아** 잔상처럼 보였다.

## 조치

`WeaponEffectsClient`의 트레이서 파라미터 조정:

- `TRACER_SPEED` 300 → **3500** (거의 즉발 수준으로 빠르게 도달 후 소멸)
- `travelTime` clamp 1.5 → **0.2** (최대 비행 시간 대폭 축소)

## 결과

목발 사격 궤적이 잔상 없이 짧게 지나가고 사라짐. 상대·봇 시점에서도 잔존하지 않음.

## 구현 위치

- `StarterPlayer.StarterPlayerScripts.WeaponEffectsClient` — TRACER_SPEED · travelTime clamp

## 변경 로그

- 2026-08-04: 트레이서 속도 상향·비행시간 축소로 궤적 잔존 제거.
