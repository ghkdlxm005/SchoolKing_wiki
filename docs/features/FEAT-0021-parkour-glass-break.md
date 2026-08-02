---
title: "FEAT-0021 파쿠르 — 유리벽 SPACE 파괴"
tags: [feature, movement, map]
---

# FEAT-0021 — 파쿠르 · 유리벽 SPACE 파괴

| 항목 | 값 |
| --- | --- |
| 상태 | 기능 구현 (3인칭 연출 추후) |
| 관련 시스템 | 이동/파쿠르, 유리벽([FEAT-0017](./FEAT-0017-glass-wall.md)) |
| 구현 위치 | `ServerScriptService.GlassWallSystem` (ProximityPrompt) |
| 날짜 | 2026-08-02 |

## 왜 (의도)

파쿠르 이동의 첫 조각. 플레이어가 유리벽 근처에 오면 SPACE로 유리를 깨고 지나갈 수 있게 한다. 지금은 **기능만**, 3인칭 파쿠르 동작/연출은 추후 기획.

## 동작

각 유리벽 Model에 `ProximityPrompt`(ParkourBreak)를 단다.

- 근처(10스터드) 접근 시 **SPACE 프롬프트("Break") 표시**.
- SPACE 누르면 기존 `breakGlass`로 파괴(파편·소리·20초 후 재생).
- 파괴 동안 프롬프트 비활성, 재생되면 다시 활성.

설정: `MaxActivationDistance=10`, `HoldDuration=0`, `RequiresLineOfSight=false`.

## 한계 / 추후

- **SPACE = 점프키 충돌**: 유리벽 근처에서 스페이스를 누르면 깨짐과 점프가 함께 일어날 수 있다. 3인칭 파쿠르 연출 작업 때 `ContextActionService`로 점프 입력을 흡수(sink)하도록 전환 예정.
- 3인칭 파쿠르 동작(뛰어넘기/타넘기)·연출은 별도 기획.

## 변경 로그

- 2026-08-02: 유리벽 근처 SPACE 프롬프트 → 파괴(기능만). 3인칭 파쿠르는 추후.
