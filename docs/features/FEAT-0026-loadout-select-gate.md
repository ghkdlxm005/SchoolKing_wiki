---
title: "FEAT-0026 라운드 시작 로드아웃 선택 게이트"
tags: [feature, system, ui, weapon]
---

# FEAT-0026 — 라운드 시작 로드아웃 선택 게이트

| 항목 | 값 |
| --- | --- |
| 상태 | 구현 · 라이브 검증 권장 |
| 관련 시스템 | 라운드 시작(CapturePointSystem) / 로드아웃(LoadoutSystem·HUDController) |
| 작성일 | 2026-08-06 |

## 개요

라운드가 시작되면 **공격 무기 1개 + 투척 무기 1개**를 고르는 선택창이 15초간 뜬다. 고르고 **Ready**를 누르거나 15초가 지나면 무기가 지급되고 카운트다운으로 넘어간다. **Dustpan(쓰레받이)** 은 전원에게 기본 지급되어 3번 키에 들어간다(추후 다른 맨손 무기 추가 예정).

## 동작

- **선택 대상**: 공격 = LegCrutch / Compass / Silicon Gun / Toaster 중 1개. 투척 = Cup / CAN 중 1개.
- **게이트 타이밍**: `CapturePointSystem`이 라운드 시작 시 `scatterPlayers → freezeAll(true)` 직후 `LoadoutSystem.runLoadoutPhase()`를 호출(yield). 15초 또는 전원 Ready까지 대기 → 무기 지급 → 3·2·1 카운트다운 → playing.
- **초과 시 기본값**: 선택/Ready 없이 15초 경과하면 **LegCrutch + Cup** 기본 지급.
- **지급 방식**: 확정 시 백팩·캐릭터의 기존 Tool을 모두 제거하고 **공격+투척+Dustpan 3개만** `StarterPack`에서 복제 지급.
- **리스폰 유지**: 선택은 `LoadoutAttack`/`LoadoutThrow` 어트리뷰트에 저장 → 리스폰 때 자동 재적용(StarterPack 기본 지급 덮어씀).
- **키 매핑**: 1 = 공격, 2 = 투척, 3 = Dustpan (HUDController).

## 구현 위치

- `ServerScriptService.LoadoutSystem`(신설) — 선택 게이트·15초·기본값·무기 지급·리스폰 재적용. Remote: `LoadoutStartEvent`(S→C), `LoadoutReadyEvent`(C→S), `LoadoutDoneEvent`(S→C).
- `ServerScriptService.CapturePointSystem` — freeze 직후 `runLoadoutPhase()` 호출.
- `StarterGui.GameHUD.HUDController` — **기존 로드아웃 메뉴(loadoutGui) 재사용** + Ready/타이머 오버레이. `LoadoutStartEvent` 시 메뉴 강제 오픈 + `MenuOpen=true`로 마우스 해제(카메라가 `MenuOpen`을 보고 마우스를 풀어줌 — 선택창에서 마우스 잠기던 문제 해결). Ready 시 `loadout.slot1`/`loadout.projectile`을 `LoadoutReadyEvent`로 전송. 키 1/2/3 매핑(공격/투척/Dustpan). (초기엔 별도 패널 `LoadoutSelectUI`를 만들었으나 레이아웃/마우스 피드백으로 폐기)

## 검증

Studio 단일: 선택창 표시 → Ready(Toaster·CAN) → 백팩에 Toaster·CAN·Dustpan만 지급 확인. 리스폰 후 동일 재적용 확인. **2인+ 라이브 재검증 권장.**

## 미구현 / 다음

- **매칭 수락 화면**(Match Found → Accept 팝업)은 `MatchmakingService`(MemoryStore 예약서버)에 붙어야 하며 **게시된 서버에서만 실동작**(Studio는 로컬 폴백) → 실서버 2인+ 테스트와 함께 별도 진행.

## 변경 로그

- 2026-08-06 (2): UI를 별도 패널에서 **기존 로드아웃 메뉴 재사용**으로 전환(레이아웃 통일) + `MenuOpen`으로 마우스 해제(선택창 마우스 잠김 수정).
- 2026-08-06: 로드아웃 선택 게이트(공격1+투척1, 15초·Ready·초과 시 목발, Dustpan 전원) 구현.
