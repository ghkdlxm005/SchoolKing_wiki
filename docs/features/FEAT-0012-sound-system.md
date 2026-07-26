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

전투 순간의 피드백을 소리로 분명하게 만든다. 그리고 경기장이라는 무대감을 살리기 위해 관중 소리를 위치를 가진 소리로 깔아 둔다.

요구는 두 축이다.

- 누구에게 들리는가 — 나만 / 전원
- 어디서 나는가 — 내 몸 / 관중석 / 2D(위치 없음)

## 설계 — `ReplicatedStorage.ClientSFX`

"나한테만 들리는 소리"를 구현하는 데 별도 필터링은 필요 없다. 클라이언트에서 생성한 `Sound`는 서버로 복제되지 않는다. 로컬 스크립트에서 만들어 재생하면 그 클라이언트에서만 들린다.

이 성질을 공통 모듈로 정리했다.

| 함수 | 재생 위치 | 들리는 대상 |
| --- | --- | --- |
| `ClientSFX.OnSelf(폴더, 이름)` | 내 `HumanoidRootPart` | 나만 |
| `ClientSFX.AtAudience(이름)` | `audience Back` 관중석 | 나만 |
| `ClientSFX.Play2D(폴더, 이름)` | 위치 없음(2D) | 나만 |

- 사운드 조회는 `SFX.<폴더>.<이름>` → `SFX.<이름>` → 하위 폴더 재귀 탐색 순으로 폴백한다. 호출부가 폴더 구조를 몰라도 된다.
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

관중이 번갈아 술렁이는 느낌을 만들기 위해, 두 소리를 절반씩 겹쳐 순환시킨다. 방출 위치는 `audience Back` 관중석이다.

```
crowd_1: [───── crowd_1 ─────]
                    ↓ 50% 지점에서 시작
crowd_2:            [───── crowd_2 ─────]
                               ↓ 50% 지점에서 시작
crowd_1:                      [───── crowd_1 ─────]  …
```

- `audience Back` 모델(같은 이름 여럿이면 전부)의 바운딩 박스 중심에 방출용 파트를 만들고 그 위 6스터드에 배치한다. `FindFirstChild`는 동명 인스턴스 중 하나만 반환하므로 전수 수집한다. → [BUG-0014](../bugs/BUG-0014-audience-outline-and-ambience.md)
- `RollOffMinDistance = 100`, `MaxDistance = 800` — 맵 전역에서 들리되 방향감은 유지된다.
- 다음 소리의 시작 시점은 `TimePosition >= TimeLength × 0.5`로 판정한다. `TimeLength`가 0이면 로드될 때까지 최대 10초 대기한다.
- `MatchState.Phase == "playing"`일 때만 동작하고, 그 외(승자 표시·카운트다운)에는 정지한다.
- 세대(generation) 카운터로 이전 루프를 확실히 종료시켜, 라운드가 빠르게 반복돼도 루프가 중첩되지 않는다.

## 구현 위치

| 파일 | 상태 | 역할 |
| --- | --- | --- |
| `ReplicatedStorage.ClientSFX` | 신규 | 내 몸 / 관중석 / 2D 재생 공통 모듈 |
| `ServerScriptService.CrowdAmbience` | 신규 | A ↔ B 교대 관중 앰비언스 |
| `StarterPlayer.StarterPlayerScripts.DeathSFX` | 신규 | 사망 감지 → `die` + `death_crowd` |
| `StarterPlayer.StarterPlayerScripts.ScoreHUD` | 수정 | 처치 시 `kill` + `kill_crowd_1/2` |
| `StarterPlayer.StarterPlayerScripts.DamageFeedback` | 수정 | `self_hit` 재생 경로를 `ClientSFX` 경유로 |
| `StarterPlayer.StarterPlayerScripts.MatchFlowHUD` | 수정 | 승자 표시 시 `victory`, 사운드 조회를 `ClientSFX` 경유로 |
| `Workspace.Kill Sound Apex Legend` | 삭제 | `SFX.hit.kill`로 대체 |

## 사운드 전수 점검

툴박스 오디오는 언제든 보관 처리될 수 있다. 콘솔에 하나씩 뜨는 걸 기다리지 말고 한 번에 확인한다. 스크립트는 [LESSON-0005](../lessons/LESSON-0005-silent-failure.md) 참조.

`TimeLength == 0`이면 로드 실패다. 2026-07-19 기준 고유 사운드 59개 / 실패 0건.

## 남은 과제

처치 순간에 관중 소리가 여러 겹으로 겹친다. 현재 동시 출력은 다음과 같다.

- `kill` (내 몸, 나만)
- `kill_crowd_1/2` (관중석, 나만)
- `Crowd Cheering` (관중석 8방향, 전원)
- `crowd_1`/`crowd_2` 앰비언스 (상시 배경)

의도된 두께인지, 일부를 빼거나 볼륨을 낮출지는 실플레이 청취 후 결정한다.

또한 `CrowdAmbience`의 시작·정지 조건을 `Phase == "playing"`으로 잡았다. 라운드 사이에도 끊기지 않게 하려면 조건을 완화해야 한다.

무기 사운드는 아직 세 군데로 흩어져 있다. 컴퍼스만 애니 마커 방식으로 정리됐고 나머지는 미구현이다. 추후 `SFX/<무기명>` 한 폴더로 모아 통일하기로 했다.

| 위치 | 현재 내용 |
| --- | --- |
| `workspace.SFX` | `move` / `hit` / `compass_sound` / `crowd` |
| `RS.GunSystem.Sounds` | `Compass`, `LegCrutch` 만 존재 |
| `<Tool>.Handle` | LegCrutch · Toaster · SiliconGun 에 3D 사운드 2개씩 |

목발·토스터·실리콘건은 발사음(`9341262362`)·재장전음(`138318339957104`)을 완전히 공유해 소리로 구분되지 않는다. `GunSystem.Sounds.LegCrutch.Melee`는 ID가 비어 있다.

## 환경·상호작용 사운드 (2026-07-26)

맵 오브젝트 상호작용에 사운드를 붙였다. 모두 3D(위치 기반), 전원 청취.

`ServerScriptService.EnvironmentSFX` (신규) — 터치 감지 + 1초 디바운스로 재생한다.

| 대상 | 판별 | 사운드 | 재생 위치 |
| --- | --- | --- | --- |
| 점프대 (JUMP DAE ×4) | `conveyorScript` 보유 파트 | `object/jump_platform` | 밟은 지점 |
| 경고등 (Alarm L·R) | 점프대 하위 | `object/gym_spot` | 경고등 지점 |
| 가속기 (Speed ×4) | `conveyorScript` 보유 파트 | `object/booster` | 밟은 지점 |
| 중앙 리프트 (Lift ×2) | `Jump Pad` 파트 | `object/lift` | 리프트 지점 |

- 대상은 이름 하드코딩이 아니라 `conveyorScript` 보유 여부로 판별한다. 맵에 점프대가 추가돼도 자동 인식된다. → [LESSON-0005](../lessons/LESSON-0005-silent-failure.md)
- `gym_spot`(경고등)은 에셋 미업로드 상태다. `SFX.object.gym_spot`에 SoundId만 넣으면 즉시 동작하며, 빈 ID면 조용히 스킵된다(에러 없음).

## 아이템 획득 사운드 (2026-07-26)

- 책(`HealHandler`) 획득 시 링 위치에서 `move/item_pickup` 재생.
- 부스트 음료(`MonsterEnergySystem`) 획득(`consume`) 시 아이템 위치에서 `move/item_pickup` 재생.

## 관중 함성 교체 (2026-07-26)

배경 함성을 `crowd_1`/`crowd_2` → **`crowd_1_fix`/`crowd_2_fix`**로 교체했다. 방출 위치는 `audience Back` 그대로 두고, 교대 순서를 고정 순환에서 **랜덤 선택**으로 바꿨다.

## 변경 로그

- 2026-07-19: `ClientSFX` 도입, 킬·사망·승리 사운드 추가, 관중 A/B 교대 앰비언스 신규. `self_hit`은 내 몸 → 2D로 환원(요청).
- 2026-07-23: 처치/사망 관중음을 `audience Back` → `audience A·B`로 이동. 처치는 전원 3D(서버), 사망은 본인만 3D(클라). `ClientSFX.AtAudienceAB` 추가. 배경 함성(`crowd_1/2`)만 Back 유지.
- 2026-07-26: 환경 사운드(점프대·경고등·가속기·리프트) `EnvironmentSFX` 신규. 아이템 획득음(책·부스트 음료) 추가. 관중 함성 `crowd_*_fix` 랜덤 교체. `gym_spot`(경고등)은 에셋 미업로드 — 자리만 생성.
- 2026-07-26: 컴퍼스 사격음(`shot_1`) 코드 트리거(Fire 애니에 마커 없음) + 타인 3D 전파, 재장전 3D 시퀀스(마커 시점). 토스터 목발 기본 소리(발사 `9341262362`·재장전 `138318339957104`) 제거 → `SFX.toaster` 전면 교체(발사·조준 2D+3D, 장전은 애니 마커). 컴퍼스 장전(`105435766235673`)·토스터 장전(`131002834663702`) 애니 교체 + 토스터 마커→`SFX.toaster` 바인딩 신설.
