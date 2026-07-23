---
title: "FEAT-0005 거점 점령전 시스템 (점수·승리)"
tags: [feature, system]
---

# FEAT-0005 — 거점 점령전 시스템 (점수 코어 + 승리/라운드)

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 1·2단계 (2026-06-30) |
| 관련 | [게임 모드](../overview/game-mode.md), [점수/랭크](../architecture/systems/meta/scoring-rank-system.md), [UI/HUD](../architecture/systems/presentation/ui-hud-system.md) |
| 통신 | `ReplicatedStorage.MatchState`(TimeLeft/Phase/Winner) + `leaderstats.Score` |

## 왜 넣는가 (의도)

데스매치 → **1v1 중앙 거점 점령전**으로 전환하는 핵심 루프 구현. 혼자 거점에 머물면 점수가 오르고, 둘 다 들어오면 멈춰 중앙 교전을 유도한다.

## 동작 (코드 기준)

### 거점 존
- `Workspace.거점 파트` (현재 27×28×1 @ -400,1.4,-133) → 런타임에 **Anchored=true, CanCollide=true**.
- 감지: 플레이어 HRP가 거점 XZ footprint 안 + 세로 −6~+16 스터드 범위면 "거점 안"으로 인정(스테이지 위 서기·점프 모두 포함).

### 점수 규칙
- 거점 안 **혼자** → 초당 점수↑ (`SCORE_PER_SEC`, 현재 **4**)
- **둘 이상** 거점 안 → 정지
- 거점 밖 → 증가 없음
- 점수는 `leaderstats.Score`(IntValue)로 집계.

### 승리 / 라운드
- **1000점**(`TARGET_SCORE`) 도달 또는 **5분**(`ROUND_TIME=300`) 종료 시 승리 판정(시간 종료 시 더 높은 점수, 동점이면 무승부).
- 종료 후 `RESET_DELAY`(6초) 뒤 점수·타이머 리셋, 다음 라운드 시작.

### HUD
- `GameHUD.TopBell` — 내 점수(ScoreNumber)·타이머(mm:ss)·모드/승리(Mode) 표시. `MatchState` 값과 `leaderstats.Score`를 클라가 구독.

## 구현 위치
- `ServerScriptService.CapturePointSystem` (Script) — 존 감지·점수·승리·라운드.
- `StarterGui.GameHUD.CaptureHUDBinder` (LocalScript) — TopBell 바인딩.
- `ReplicatedStorage.MatchState` (Folder: TimeLeft/Phase/Winner).

## 튜닝값
| 값 | 의미 | 현재 |
| --- | --- | --- |
| `SCORE_PER_SEC` | 거점 단독 점유 시 초당 점수 | 4 |
| `TARGET_SCORE` | 승리 점수 | 1000 |
| `ROUND_TIME` | 라운드 길이(초) | 300 |

## 남은 단계 / 메모
- 미구현: 거점 안 처치 보너스, 4모서리 스폰, 파밍 오브젝트 → [백로그](../todo/backlog.md)
- **`거점 파트` 오브젝트 자체(위치·크기·형태)는 추후 변경될 수 있음.** 변경돼도 시스템은 그 파트의 CFrame·Size를 그대로 사용하므로 동작은 유지된다.

## 변경 로그
- 2026-06-30: 1·2단계 구현(거점 점수, 1000점/5분 승리·라운드, HUD 연동). 점수 속도 8→4, 거점 감지 세로범위 확대.
