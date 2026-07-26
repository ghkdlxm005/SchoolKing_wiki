---
title: "BUG-0016 앉은 채 W(전진)가 Studio에서만 안 먹힘"
tags: [bug, movement, input]
---

# BUG-0016 — 앉은 채 W(전진)가 Studio에서만 안 먹힘

| 항목 | 값 |
| --- | --- |
| 상태 | 환경 원인 · 코드 무결 (2026-07-26) |
| 심각도 | low (실게임 영향 없음) |
| 관련 시스템 | 이동(SlideScript), 입력, Studio 테스트 |
| 발견일 | 2026-07-26 |

## 증상

앉기(LeftCtrl)를 누른 채 W(전진)를 누르면 앞으로 안 감. A·S·D(좌·우·후진)는 정상.
Studio 플레이 테스트에서만 발생하고, 퍼블리시된 실제 플레이어에서는 문제없음.

## 원인

`Ctrl+W`가 **Roblox Studio의 예약 단축키**라, Studio(에디터)가 이 조합을 먼저 가로챈다. 그래서 플레이 테스트 중에도 W 키가 게임 엔진에 도달하지 못한다.

진단으로 확정했다. 앉은 채 W를 누르는 동안 키 상태를 찍어 보면:

| 신호 | 값 | 의미 |
| --- | --- | --- |
| `IsKeyDown(LeftControl)` | true | Ctrl은 게임에 들어옴(그래서 앉기는 됨) |
| `IsKeyDown(W)` | **false** | W는 게임에 안 들어옴 |
| W `InputBegan` 발생 횟수 | **0** | 엔진이 W 키다운 이벤트를 한 번도 못 받음 |

`Humanoid.MoveDirection`도 0, 컨트롤 모듈의 `GetMoveVector()`도 (0,0). 이동 로직이 W를 무시한 게 아니라, **입력 자체가 엔진에 닿기 전에 사라진** 것이다. 실제 플레이어 앱에는 Ctrl+W 단축키가 없어 그대로 통과하므로 정상 동작한다.

## 조치

코드 변경 없음(앉기·이동 로직 정상). 재현·추적 과정에서 넣었던 임시 진단(SlideScript 내 로그, 화면 KEY/MOVE HUD)은 전부 제거했고, 오작동을 의심했던 지점(FaceCameraLock 등)도 검토 후 원복해 무관함을 확인했다.

Studio에서 이 조작을 테스트하려면 둘 중 하나:

1. `파일 → 고급 → 단축키 사용자화`에서 `Ctrl+W` 바인딩 제거
2. 실제 플레이어(퍼블리시)로 테스트

## 결과

실게임 영향 없음. 앉아 걷기는 전 방향 모두 실제 플레이어에서 정상. Studio가 Ctrl+W를 삼키는 환경 특성으로 확정.

## 관련

- [FEAT-0013](../features/FEAT-0013-r6-to-r15-migration.md) — R15 전환. 앉기 시점 초기 의심 지점이었으나 무관으로 판명.
- [LESSON-0006](../lessons/LESSON-0006-input-not-code.md) — "특정 키만 안 먹힘"은 코드보다 입력 도달 여부를 먼저 본다.

## 구현 위치

- `StarterPlayer.StarterCharacterScripts.SlideScript` — 앉기·이동 로직 (변경 없음, 정상)

## 변경 로그

- 2026-07-26: 증상 재현·진단으로 원인이 Studio의 Ctrl+W 단축키 가로챔임을 확정. 코드 변경 없음. 임시 진단 제거.
