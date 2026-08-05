---
title: "BUG-0029 SlideScript cleanupAll에서 targetSpeedFor nil 호출"
tags: [bug, movement]
---

# BUG-0029 — SlideScript cleanupAll에서 targetSpeedFor nil 호출

| 항목 | 값 |
| --- | --- |
| 상태 | fixed |
| 심각도 | medium |
| 관련 시스템 | 이동 상태머신(SlideScript) |
| 발견일 | 2026-08-05 |

## 증상

플레이 중(사망/캐릭터 정리 시점) 콘솔 에러:

```
Workspace.Player1.SlideScript:271: attempt to call a nil value
Script 'Workspace.Player1.SlideScript', Line 271 - function cleanupAll
```

## 원인

`cleanupAll`(241줄)은 정리 시 `Humanoid.WalkSpeed = targetSpeedFor(State.WALKING)`를 호출한다. 그런데 `targetSpeedFor`는 **426줄에서 `local function targetSpeedFor(...)`로 정의** — cleanupAll보다 뒤다.

스크립트 상단에는 "cleanupAll references helpers defined later"라며 포워드 선언 목록(`local stopAllTracks`, `local setCameraOffset`)이 있었지만 **`targetSpeedFor`가 그 목록에서 빠져 있었다**. 게다가 426줄이 `local function`이라 **새 지역변수**를 만들어, cleanupAll 스코프에서 보는 `targetSpeedFor`는 전역(=nil)이었다 → 호출 시 "attempt to call a nil value".

평소엔 cleanupAll이 호출되지 않아 잠복해 있다가, 사망/정리 경로가 실행되며 드러났다.

## 조치

Lua 포워드 선언 패턴을 완성:

1. 상단 포워드 선언에 **`local targetSpeedFor` 추가**(stopAllTracks·setCameraOffset과 같은 위치).
2. 426줄 정의를 `local function targetSpeedFor(st)` → **`function targetSpeedFor(st)`**(새 지역변수 생성이 아니라 포워드 선언된 업밸류에 할당).

이제 cleanupAll·setState 모두 같은 `targetSpeedFor` 업밸류를 참조한다.

## 결과

사망/정리 시 에러 없이 WalkSpeed가 복원된다. 문법 검사 통과.

## 구현 위치

- `StarterPlayer.StarterCharacterScripts.SlideScript` — 포워드 선언 + targetSpeedFor 정의 형태

## 재발 방지

- **앞에서 참조하고 뒤에서 정의하는 로컬 함수는 반드시 포워드 선언**(`local name`)하고, 정의는 `function name(...)`(no `local`)로 업밸류에 할당. `local function name`을 뒤에 쓰면 앞 참조는 nil.

## 변경 로그

- 2026-08-05: targetSpeedFor 포워드 선언 추가 + local 제거로 cleanupAll nil 호출 해소.
