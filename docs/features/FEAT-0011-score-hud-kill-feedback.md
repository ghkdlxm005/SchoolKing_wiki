---
title: "FEAT-0011 점수판 · 킬 피드백 UI"
tags: [feature, ui, system]
---

# FEAT-0011 — 점수판 · 킬 피드백 UI

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 |
| 관련 | [거점 점령전](./FEAT-0005-capture-point.md) 점수 코어, [사운드](./FEAT-0012-sound-system.md) |

## 왜 넣는가 (의도)

점수 상황과 처치 피드백을 화면에서 바로 보이게 한다. 누가 몇 점인지(등수), 내가 왜 점수를 얻었는지(사유)를 즉시 전달한다.

## 동작 (코드 기준 · 2026-07-19 확인)

### 랭킹 바 (상단 중앙)

- 위치는 상단 중앙, 스코어 패널 아래(`AnchorPoint (0.5, 0)`, `y = 132`).
- 점수순 정렬 후 상위 4명(`MAX_SHOW`)만 노출한다. 동시 전투 인원 기준.
- 각 셀은 등수(`#1`~`#4`) · 프로필 얼굴(HeadShot 썸네일, 캐시) · 점수로 구성된다.
- 등수 색: 1위 금 / 2위 은 / 3위 동 / 그 외 회색. 등수 텍스트·프로필 링·점수 텍스트 세 곳에 적용한다.
  - 인게임 플레이어 외곽선에는 적용하지 않는다. 시도했다가 철회했다. 아래 [메모](#메모) 참조.
- 본인 표시: 프로필 링에 흰색 `UIStroke`.
- 화면 크기에 맞춰 `UIScale` 비례 축소(1280×720 기준, 0.55~1.0).

### 갱신 방식

상단 SCORE와 표시 시점이 어긋나지 않도록 `leaderstats.Score.Changed` 이벤트로 구동한다. 프레임당 1회만 렌더하고(dirty 플래그), 2초 주기 폴링은 안전망으로만 둔다.

### 점수 획득 팝업

점수를 얻는 순간 스코어 숫자 옆에서 `+N + 사유`가 떠오르며 사라진다. 글자는 전부 흰색이다.

| 상황 | 표기 |
| --- | --- |
| 거점 유지(1초 틱) | `+5  Zone Hold` |
| 일반 처치 | `+20  Kill` |
| 거점 내 처치 | `+50  Zone Kill` |
| 연속 처치(2연속~) | `+80  Kill Streak x3` |

표기는 영어로 통일한다. 로블록스 자동 번역을 태우기 위함이다. UI 문자열에 한국어를 하드코딩하지 않는다.

### 거점 점령 배너

거점 안에 있는 동안 화면 하단(높이 0.66)에 배너를 띄운다. 서버가 매 틱 갱신하는 `InZone` 속성으로 켜고 끈다.

### 처치 사운드 / 관중 환호

- 처치 사운드: `kill`(내 몸) + `kill_crowd_1`/`_2` 랜덤(관중석). 처치한 본인만 청취한다.
- 관중 환호: `Crowd Cheering`을 관중석(Seatbase) 8방향 에미터에서 재생해 전원이 맵 바깥 사방에서 듣는다(2초 디바운스).

상세는 [FEAT-0012](./FEAT-0012-sound-system.md) 참조.

## 신호 흐름

- 서버 `CapturePointSystem`: 점수 확정 시 `ScoreGainEvent:FireClient(plr, gain, inZone, streak, kind)` + `playCrowd()`. `kind`는 `"kill"` / `"zone"`.
- 클라 `ScoreHUD`: 랭킹 갱신 + 팝업 + 처치 사운드.

## 구현 위치

- `ServerScriptService.CapturePointSystem` — `ScoreGainEvent`, 관중 환호 에미터, `InZone` 속성.
- `StarterPlayer.StarterPlayerScripts.ScoreHUD` — 랭킹 바·팝업·거점 배너·처치 사운드.
- `StarterPlayer.StarterPlayerScripts.HUDResponsive` — 해상도 대응.

## 메모

- 크로스헤어는 점(dot)만 남기고 십자선을 제거했다(별개 변경).
- 등수별 외곽선 색은 철회됐다. 등수 색을 인게임 외곽선(`EnemyOutline`)에도 입혔더니, 색이 지정된 외곽선이 연막 가림 판정을 무시하고 계속 보이는 문제가 있었다. 외곽선은 흰색 단일로 환원했다.
- 신규 HUD는 `GameHUD.HUDController`의 `KEEP_GUI` 목록에 등록해야 화면에 나온다. → [BUG-0007](../bugs/BUG-0007-hud-screengui-whitelist.md)

## 변경 로그

- 2026-07-12: 점수판(등수·얼굴·점수) + 킬 획득 사유 팝업 + 킬 사운드(본인) + 관중 환호(관중석) 추가.
- 2026-07-19: 랭킹 바를 상단 중앙으로 이동(최대 4명), 갱신을 이벤트 기반으로 전환, 사유 문구 영어화, 본인 표시를 흰 테두리로 변경, 거점 배너 추가. 등수별 외곽선 색 철회.
- 2026-07-19: 처치 사운드를 `Kill Sound Apex Legend` → **`kill` + `kill_crowd_1/2`** 로 교체.
