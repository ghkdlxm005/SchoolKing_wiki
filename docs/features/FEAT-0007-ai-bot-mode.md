---
title: "FEAT-0007 AI bot mode (전투 봇)"
tags: [feature, system]
---

# FEAT-0007 — AI bot mode (전투 봇)

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (2026-07-03) · 반복 개선 중 |
| 관련 | [스폰/리스폰](../architecture/systems/meta/spawn-respawn-system.md), [게임 모드](../overview/game-mode.md) |
| 통신 | `ReplicatedStorage.BotSpawnEvent` (RemoteEvent) |

## 왜 넣는가 (의도)

혼자서도 전투를 테스트·연습할 수 있도록, **Tab 메뉴 버튼으로 AI 봇 2기를 소환**해 상대한다.

## 동작 (코드 기준)

### 소환
- Tab(장비 메뉴) 하단 **🤖 AI bot mode** 버튼 → `BotSpawnEvent:FireServer()`.
- 서버가 **플레이어 스폰 지점(SpawnLocation)**에 봇을 채워 항상 2기 유지(이미 2기면 추가 안 함).
- 봇 = 플레이어와 동일: `CreateHumanoidModelFromDescription(R6)` 리그(HumanoidRootPart·Animate·바디컬러) + `ShieldSystem.InitNPC(hum, 100, 100)`(체력·쉴드 플레이어 동일).
- 리그 템플릿은 `ServerStorage.BotTemplate`(Animate를 **서버 Script**로 변환해 NPC도 걷기 애니 재생).

### 행동
- **거점 이동**: 타깃 없으면 거점으로 걸어감.
- **시야 교전**: 시야 콘(±75°) + 사거리 95 + LOS(레이캐스트)를 통과한 플레이어 발견 → 추격·사격(0.7초/데미지 6 + 트레이서), 선호 교전거리(~22) 유지하며 스트레이프.
- **피격 주목**: 데미지 받으면(HealthChanged 감소) 가장 가까운 플레이어(=쏜 사람 추정)를 1.3초간 주목·추격.
- **리스폰**: `DummyRespawn`이 죽은 봇을 스폰 지점에서 자동 리스폰(기본 100/100 = 플레이어 동일).

## 구현 위치
- `ServerScriptService.BotManager` — 온디맨드 스폰 + AI (`CFG`로 튜닝).
- `ServerStorage.BotTemplate` — 플레이어 동일 리그(Animate=서버 Script).
- `ReplicatedStorage.BotSpawnEvent` (RemoteEvent).
- `StarterGui.GameHUD.HUDController` — Tab 메뉴 버튼.

## 남은 것 / 메모
- 향후: 리스폰 지점 지정·봇 수 조절 UI, 실제 무기 파지, 경로탐색(PathfindingService)로 장애물 회피.
- 봇은 판정+트레이서로 사격(무기 Tool을 들지는 않음).

## 변경 로그
- 2026-07-03: Tab 버튼 소환, 봇 2기(플레이어 동일 HP·쉴드), 거점 이동/시야 교전/피격 주목, 플레이어 리그(Animate 서버 변환).
