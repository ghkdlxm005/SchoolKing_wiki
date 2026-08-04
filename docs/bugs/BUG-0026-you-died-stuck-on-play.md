---
title: "BUG-0026 PLAY 시 YOU DIED 화면 박제"
tags: [bug, ui, respawn]
---

# BUG-0026 — PLAY 시 YOU DIED 화면 박제

| 항목 | 값 |
| --- | --- |
| 상태 | fixed |
| 심각도 | high |
| 관련 시스템 | 데스캠/UI(DeathScreen) · 메인메뉴(MainMenuController) |
| 발견일 | 2026-08-04 |

## 증상

살아있는데도 PLAY로 진입하면 화면에 **"YOU DIED"(DeathScreen)** 가 그대로 떠 박제되는 경우가 있었다.

## 원인

`MainMenuController`의 `setHudHidden`(로비에서 HUD를 숨기는 로직)이, **로비 강제 표시 대상 목록(HIDE_IN_LOBBY 처리)** 에 `DeathScreen`을 포함해 **강제로 Enabled=true** 로 켜고 있었다. 실제로 모니터링 결과 스폰 극초기(t≈0.02s)에 `DeathScreen.Enabled=true`인데 `DeadCam`은 nil이라, 사망 상태가 아닌데도 사망 화면이 남았다.

## 조치

- `setHudHidden`에서 `DeathScreen`을 **강제 표시 대상에서 제거**.
- 로비에서는 DeathScreen을 **끄기만** 하고, 절대 강제로 켜지 않도록 변경(사망 화면의 표시 권한은 데스캠 시스템만 갖도록).

## 결과

PLAY 진입/스폰 시 사망이 아니면 DeathScreen이 뜨지 않음. 실제 사망 시에는 데스캠 시스템이 정상적으로 표시.

## 구현 위치

- `StarterPlayer.StarterPlayerScripts.MainMenuController` — `setHudHidden`의 DeathScreen 강제표시 제거

## 관련

- [FEAT-0016 데스캠·리스폰](../features/FEAT-0016-deathcam-respawn.md)

## 변경 로그

- 2026-08-04: 로비 HUD 처리에서 DeathScreen 강제표시 제거(박제 해소).
