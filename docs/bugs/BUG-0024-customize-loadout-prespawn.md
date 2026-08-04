---
title: "BUG-0024 메인화면 Customize 무기 선택창 안 뜸"
tags: [bug, ui]
---

# BUG-0024 — 메인화면 Customize 무기 선택창 안 뜸

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (라이브 재검증 필요) |
| 심각도 | medium |
| 관련 시스템 | GameHUD / 로드아웃 / 메인메뉴 |
| 발견일 | 2026-08-04 |

## 증상

게임 접속 후 **첫 메인화면**에서 Customize 버튼을 눌러도 무기 선택(로드아웃) 창이 안 떴다. 한 번 플레이한 뒤에는 정상 동작.

## 원인

로드아웃 창과 Customize 처리는 `GameHUD`(StarterGui) 안의 `HUDController`가 만든다. 그런데 **StarterGui의 GUI는 캐릭터가 처음 스폰될 때 PlayerGui로 복사**된다. 로비는 `CharacterAutoLoads=false`라 PLAY 전엔 캐릭터가 없어, GameHUD가 PlayerGui에 아직 없고 HUDController도 실행되지 않았다. 그래서 로드아웃 창 자체가 없고 Customize(`RequestCustomize`) 리스너도 연결돼 있지 않았다. (다른 로비 GUI들은 스크립트가 직접 PlayerGui에 생성해서 영향이 없었다.)

## 조치

- `HUDEarlyLoad`(StarterPlayerScripts) 신설: 접속 시 GameHUD를 PlayerGui에 미리 복제(`ResetOnSpawn=false`) → HUDController가 로비에서도 실행.
- 첫 스폰 때 StarterGui가 두 번째 GameHUD를 복사해도, HUDController가 `__HUDActive` 표식으로 **중복 사본을 스스로 폐기**.
- 로비(`InLobby=true`) 중엔 매치 HUD 프레임(신분증·상태·힐·투척 박스)을 숨기고, 로드아웃 창이 열릴 때만 `DisplayOrder`를 메인메뉴(1000) 위로 올린다.

## 결과

Studio 검증: 첫 메인화면(캐릭터 없음)에서 GameHUD 1개 존재, 로드아웃 창 생성됨, Customize 시 창이 메뉴 위에 표시. 스폰 후에도 GameHUD는 1개로 유지되고 매치 HUD 정상 표시. **라이브 재검증 권장.**

## 구현 위치

- `StarterPlayer.StarterPlayerScripts.HUDEarlyLoad` (신설)
- `StarterGui.GameHUD.HUDController` (중복 폐기 + 로비 숨김 + DisplayOrder)

## 변경 로그

- 2026-08-04: GameHUD 조기 로드 + 중복 폐기 + 로비 숨김으로 첫 메뉴 Customize 동작화.
