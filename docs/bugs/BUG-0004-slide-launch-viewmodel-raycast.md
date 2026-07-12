---
title: "BUG-0004 무기 든 채 슬라이딩 시 하늘로 날아감"
tags: [bug, movement]
---

# BUG-0004 — 실리콘건·토스터 든 채 슬라이딩 시 하늘로 날아감

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-12) |
| 심각도 | high |
| 관련 시스템 | 이동(SlideScript), 뷰모델 |
| 발견일 | 2026-07-12 |

## 증상

**실리콘건 / 토스터**를 든 상태로 슬라이딩하면 캐릭터가 하늘 높이 솟구쳤다. (목발 3인칭 리깅 작업 이후 유입)

## 원인

슬라이드는 경사·높낮이 대응을 위해 **아래로 raycast해서 몸을 바닥에 붙이는 스냅** 로직이 있다. 이 레이캐스트가 `{ Character }`만 제외했는데, **카메라 밑 뷰모델 파트**(실리콘건/토스터는 뷰모델이 9개 파트, `CanQuery=true`)가 캐릭터 아님으로 취급되어 레이에 잡혔다.

레이가 뷰모델(몸통~머리 높이)을 "바닥"으로 인식 → `targetY = 히트 + 몸통높이`가 캐릭터 근처/위로 잡히고, 근접 조건에 걸려 **매 프레임 그 높이로 끌어올림** → 상승 누적으로 승천.

## 해결

슬라이드 지면 스냅 레이캐스트를:

- **필터에 카메라(뷰모델) 추가**: `FilterDescendantsInstances = { Character, workspace.CurrentCamera }`
- **실제 충돌 바닥만 인정**: 히트가 `CanCollide=true`일 때만 스냅(`if _hit and _hit.Instance and _hit.Instance.CanCollide then`).

→ 뷰모델·이펙트 파트를 바닥으로 오인하지 않음. 모든 무기에서 안전.

## 구현 위치

- `StarterPlayer.StarterCharacterScripts.SlideScript` — 슬라이드 중 지면 raycast.

## 변경 로그

- 2026-07-12: 카메라(뷰모델) 필터 제외 + CanCollide 바닥만 스냅.
