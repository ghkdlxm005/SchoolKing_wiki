---
title: 이벤트 시스템 (RemoteEvent 통신)
tags: [system, event]
---

# 이벤트 시스템 (RemoteEvent 통신)

## 책임

클라이언트↔서버 통신 객체(RemoteEvent/Function)의 단일 관리처.

## 통신 목록(예시)

| 이벤트 | 방향 | 용도 |
| --- | --- | --- |
| `FireWeapon` | C→S | 발사 요청 |
| `ThrowGrenade` | C→S | 수류탄 투척 |
| `DamageDealt` | S→C | 피격 연출 |
| `ScoreUpdate` | S→C | 점수/1등/리벤지 갱신 |

새 통신을 추가하면 이 표에 먼저 등록한다(서버 권위 원칙 유지).

#system #event
