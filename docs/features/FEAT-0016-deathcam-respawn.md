---
title: "FEAT-0016 데스캠 · 리스폰 시스템"
tags: [feature, respawn, ui]
---

# FEAT-0016 — 데스캠 · 리스폰 시스템

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 · 튜닝 여지 |
| 관련 시스템 | 사망/리스폰, 카메라, 로드아웃 UI |
| 구현 위치 | `ServerScriptService.DeathRespawnSystem`(신규), `StarterPlayerScripts.DeathCamController`(신규), `GameHUD.HUDController` |
| 날짜 | 2026-08-02 |

## 개요

사망 시 조작 불가 + Death cam 전환, 리스폰 대기(최소 2초 / 자동 10초 / SPACE 조기), 대기 중 TAB 무기 변경(블러 + 상세 카드)까지 묶은 리스폰 흐름.

## 리스폰 제어 (서버)

`Players.CharacterAutoLoads`를 끄고 `DeathRespawnSystem`이 직접 관리한다.

- 사망 → `DeathStateEvent`로 클라 통지(자동 시간·최소 시간·사망 위치·킬러 전달).
- **최소 2초**는 부활 불가. 이후 `RespawnRequest`(SPACE)로 조기 부활.
- 미입력 시 **자동 10초** 후 부활. 세션 가드로 중복 스폰 방지.
- 접속·리스폰 스폰도 이 시스템이 `LoadCharacter`로 처리(자동 로드 껐으므로).

## 데스캠 (클라)

`DeathCamController`가 사망 시 카메라를 `Workspace.Death cam` 파트 위치·방향에 고정한다(파트 앵커).

화면 표시:
- 2초 전: `리스폰 가능까지 N초`
- 2초 후: `SPACE를 눌러 리스폰`
- 항상: `자동 리스폰까지 N초`

## 사망 중 무기 변경

- 평소엔 TAB이 안 뜨고, **죽었을 때만**(`DeadCam` 어트리뷰트) TAB으로 로드아웃이 열린다.
- 열리면 데스캠에 블러(`BlurEffect`)가 걸리고 그 위에 무기 선택창이 뜬다. 데스 UI는 잠시 숨긴다.
- 리스폰하면 창이 자동으로 닫힌다.
- 선택한 무기는 다음 리스폰부터 적용.

## 무기 선택창 카드

각 무기가 카드로 표시된다: 이름, 이미지 영역(`WEAPON_REGISTRY.image`, 없으면 플레이스홀더), 짧은 설명, 사거리·공격력·연사력(`GunConfig` 실수치), 특수효과. 무기는 1슬롯으로 축소(무기 1 + 투척류).

## 변경 로그

- 2026-08-02: 신규. 데스캠(Death cam 파트 고정), 2초/10초/SPACE, TAB 전용 로드아웃(블러)+상세 카드, 자동 로드 끄고 서버 리스폰 관리.
