---
title: "FEAT-0012 사운드 개편 (킬·사망·승리·관중 앰비언스)"
tags: [feature, sound]
---

# FEAT-0012 — 사운드 개편 (킬·사망·승리·관중 앰비언스)

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 · 볼륨 밸런스 검토 중 |
| 관련 시스템 | 사운드 / 전투 피드백 / 라운드 흐름 |
| 날짜 | 2026-07-19 |

## 목표

전투 순간의 피드백을 **소리로 분명하게** 만든다. 그리고 경기장이라는 무대감을 살리기 위해 관중 소리를 **위치를 가진 소리**로 깔아 둔다.

핵심 요구는 두 축이다.

- **누구에게 들리는가** — 나만 / 전원
- **어디서 나는가** — 내 몸 / 관중석 / 2D(위치 없음)

## 설계 — `ReplicatedStorage.ClientSFX`

"나한테만 들리는 소리"를 구현하는 데 별도 필터링은 필요 없다. **클라이언트에서 생성한 `Sound`는 서버로 복제되지 않는다.** 로컬 스크립트에서 만들어 재생하면 그 클라이언트에서만 들린다.

이 성질을 공통 모듈로 정리했다.

| 함수 | 재생 위치 | 들리는 대상 |
| --- | --- | --- |
| `ClientSFX.OnSelf(폴더, 이름)` | 내 `HumanoidRootPart` | 나만 |
| `ClientSFX.AtAudience(이름)` | `audience Back` 관중석 | 나만 |
| `ClientSFX.Play2D(폴더, 이름)` | 위치 없음(2D) | 나만 |

- 사운드 조회는 `SFX.<폴더>.<이름>` → `SFX.<이름>` → **하위 폴더 재귀 탐색** 순으로 폴백한다. 호출부가 폴더 구조를 몰라도 된다.
- `OnSelf`는 캐릭터가 없으면 2D로 폴백해 소리가 통째로 빠지는 일이 없게 한다.
- 재생이 끝나면 자동 정리하고, `Debris`로 이중 안전망을 둔다.

**전원에게 들려야 하는 소리는 서버에서 만든다.** 이 원칙 하나로 대상 제어가 끝난다.

## 사운드 목록

| 소리 | 언제 | 위치 | 대상 |
| --- | --- | --- | --- |
| `self_hit` | 내가 피격 | 2D | 나만 |
| `kill` | 내가 처치 | 내 몸 | 나만 |
| `kill_crowd_1` / `_2` (랜덤) | 내가 처치 | `audience A·B` | **전원** |
| `die` | 내가 사망 | 내 몸 | 나만 |
| `death_crowd` | 내가 사망 | `audience A·B` | 나만 |
| `victory` | 라운드 종료(승자 표시) | 2D | **전원** |
| `Crowd Cheering` | 처치 발생 | 관중석 8방향 | **전원** |
| `crowd_1` / `crowd_2` | 게임 시작 후 상시 | `audience Back` (3D, 교대) | **전원** |

## 관중 앰비언스 — A ↔ B 교대

`ServerScriptService.CrowdAmbience` (신규)

관중이 **번갈아 술렁이는** 느낌을 만들기 위해, 두 소리를 절반씩 겹쳐 순환시킨다. 방출 위치는 **`audience Back`** 관중석이다.

```
crowd_1: [───── crowd_1 ─────]
                    ↓ 50% 지점에서 시작
crowd_2:            [───── crowd_2 ─────]
                               ↓ 50% 지점에서 시작
crowd_1:                      [───── crowd_1 ─────]  …
```

- `audience Back` 모델(같은 이름 여럿이면 전부)의 **바운딩 박스 중심**에 방출용 파트를 만들고 그 위 6스터드에 배치. `FindFirstChild`는 동명 인스턴스 중 하나만 반환하므로 전수 수집한다. → [BUG-0014](../bugs/BUG-0014-audience-outline-and-ambience.md)
- `RollOffMinDistance = 100`, `MaxDistance = 800` — 맵 전역에서 들리되 **방향감은 유지**된다.
- 다음 소리의 시작 시점은 `TimePosition >= TimeLength × 0.5` 로 판정. `TimeLength`가 0이면 로드될 때까지 최대 10초 대기한다.
- `MatchState.Phase == "playing"` 일 때만 동작하고, 그 외(승자 표시·카운트다운)에는 정지한다.
- **세대(generation) 카운터**로 이전 루프를 확실히 종료시켜, 라운드가 빠르게 반복돼도 루프가 중첩되지 않는다.

## 구현 위치

| 파일 | 상태 | 역할 |
| --- | --- | --- |
| `ReplicatedStorage.ClientSFX` | **신규** | 내 몸 / 관중석 / 2D 재생 공통 모듈 |
| `ServerScriptService.CrowdAmbience` | **신규** | A ↔ B 교대 관중 앰비언스 |
| `StarterPlayer.StarterPlayerScripts.DeathSFX` | **신규** | 사망 감지 → `die` + `death_crowd` |
| `StarterPlayer.StarterPlayerScripts.ScoreHUD` | 수정 | 처치 시 `kill` + `kill_crowd_1/2` |
| `StarterPlayer.StarterPlayerScripts.DamageFeedback` | 수정 | `self_hit` 재생 경로를 `ClientSFX` 경유로 |
| `StarterPlayer.StarterPlayerScripts.MatchFlowHUD` | 수정 | 승자 표시 시 `victory`, 사운드 조회를 `ClientSFX` 경유로 |
| `Workspace.Kill Sound Apex Legend` | **삭제** | `SFX.hit.kill`로 대체 |

## 사운드 전수 점검

툴박스 오디오는 언제든 보관 처리될 수 있다. 콘솔에 하나씩 뜨는 걸 기다리지 말고 한 번에 확인한다. 스크립트는 [LESSON-0005](../lessons/LESSON-0005-silent-failure.md) 참조.

`TimeLength == 0`이면 로드 실패다. 2026-07-19 기준 **고유 사운드 59개 / 실패 0건**.

## 남은 과제

**처치 순간에 관중 소리가 여러 겹으로 겹친다.** 현재 동시 출력은 다음과 같다.

- `kill` (내 몸, 나만)
- `kill_crowd_1/2` (관중석, 나만)
- `Crowd Cheering` (관중석 8방향, 전원)
- `crowd_1`/`crowd_2` 앰비언스 (상시 배경)

의도된 두께인지, 일부를 빼거나 볼륨을 낮출지 **실플레이 청취 후 결정** 필요.

또한 `CrowdAmbience`의 시작·정지 조건을 `Phase == "playing"` 으로 잡았다. 라운드 사이에도 끊기지 않게 하려면 조건을 완화해야 한다.

**무기 사운드는 아직 세 군데로 흩어져 있다.** 컴퍼스만 애니 마커 방식으로 정리됐고 나머지는 미구현이다. 추후 `SFX/<무기명>` 한 폴더로 모아 통일하기로 했다.

| 위치 | 현재 내용 |
| --- | --- |
| `workspace.SFX` | `move` / `hit` / `compass_sound` / `crowd` |
| `RS.GunSystem.Sounds` | `Compass`, `LegCrutch` 만 존재 |
| `<Tool>.Handle` | LegCrutch · Toaster · SiliconGun 에 3D 사운드 2개씩 |

목발·토스터·실리콘건은 발사음(`9341262362`)·재장전음(`138318339957104`)을 **완전히 공유**해 소리로 구분되지 않는다. `GunSystem.Sounds.LegCrutch.Melee`는 ID가 비어 있다.

## 변경 로그

- 2026-07-19: `ClientSFX` 도입, 킬·사망·승리 사운드 추가, 관중 A/B 교대 앰비언스 신규. `self_hit`은 내 몸 → **2D로 환원**(요청).
- 2026-07-23: 처치/사망 관중음을 `audience Back` → **`audience A·B`** 로 이동. **처치는 전원 3D(서버), 사망은 본인만 3D(클라)**. `ClientSFX.AtAudienceAB` 추가. 배경 함성(`crowd_1/2`)만 Back 유지.
