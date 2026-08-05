---
title: 맵 상호작용 요소 · 사운드 카탈로그
sidebar_position: 6
tags: [architecture, reference, snapshot, map, sound]
---

# 맵 상호작용 요소 · 사운드 — 2026-08-05

`Workspace` 순회로 뜬 시스템 연동 요소들. (장식 파트 다수는 생략)

## 상호작용 / 시스템 파트

| 이름 | 수량 | 클래스 | 연동 시스템 |
| --- | ---: | --- | --- |
| Rope_act | 2 | TrussPart | 그래플 집라인([FEAT-0025](../../features/FEAT-0025-grapple-zipline.md)). 기울어진 빔, 끝-끝 라이드 |
| Point | 1 | TrussPart | (구)그래플 지점 — 현재는 Rope_act 중심 |
| glass wall | 16 | Part | 파괴 가능한 유리벽(GlassWallSystem). 시선+근접 프롬프트(GazeInteract) |
| E to Open Door | 5 | Model | 문 — 프롬프트 상호작용(GazeInteract 대상) |
| MetalDoubleDoor | 5 | Model | 양문형 문 |
| Fire Extinguisher | 5 | Model | 소화기(FireExtinguisherSystem) — 파괴 시 연막 |
| Smoke | 5 | Model | 연막 파트 뭉치(기본 투명, 피격 시 노출) |
| Fog Machine | 다수 | Model | 포그 연출(장식) |
| 거점 파트 | 1 | Part | 거점(CapturePointSystem) 점령 존 |
| Monster Energy | 7 | Tool | 랜덤 능력 픽업(MonsterEnergySystem) |
| Trash | 2 | MeshPart | 장식(스크립트 없는 "Pick up Trash" 프롬프트) |
| SpawnLocation | 4 | SpawnLocation | 스폰 지점 |
| JUMP DAE / High Jump | 다수 | Model | 점프대(JumpPadSystem) |
| Lift / Speed | 여러 | Model | 리프트 / 가속기(EnvironmentSFX) |
| Alarme Light red | 5 | Model | 경고등 |
| audience A/B/Back | 여러 | Model | 관중(윤곽선·함성, CrowdAmbience) |
| Death cam / Start cam | 각 1 | MeshPart | 데스캠/시작캠 시점 파트 |
| Dummies | 1 | Folder | 연습 더미(DummyCloseShooter) |

## 사운드 카탈로그 — `Workspace.SFX`

카테고리별 폴더. 코드에서 `workspace.SFX.<카테고리>.<이름>` 경로로 참조.

| 카테고리 | 사운드 |
| --- | --- |
| move | sliding, sneak_walk, gym_running, gym_walking, item_pickup |
| hit | hp_hit, shield_crack, shield_hit, self_hit, kill, die |
| crowd | crowd_1, crowd_2, **crowd_1_fix, crowd_2_fix**(현재 교차 사용), kill_crowd_2, death_crowd, victory, game_start, Crowd cheering sound effect |
| object | jump_platform, Smoke Grenade, lift, booster, gym_spot, OG glass break sound, ALARM OFFICAL |
| compass_sound | spin_1~3, gear_1~2, shot_1~2, reload_1~3, ready, clink_1~2 |
| toaster | charge_1~2, aiming, toaster_reload_1~2, toaster_ready, toaster_dial, toaster_shot_1~2, hold_toaster |
| silicon | silicon_hold, silicon_ready, silicon_reload_1~2, silicon_shot |
| can | can_hold, can_ready, can_throw, can_explode, can_sparkle |
| cup | cup_hold, cup_ready, cup_throw, cup_explode |
| dustpan | dustpan_hold |
| throw | Glass Bottle Break, Drop soda can, water splash (구 임시음 — 일부 폐기) |

> 슬라이드음 `move.sliding`(id 81830900004468)은 **슬라이드 시작 순간** SlideSoundServer가 캐릭터에서 3D 재생. 관중 함성은 `crowd_1_fix`/`crowd_2_fix`를 랜덤 교차.

## 무기 모델·뷰모델 (Workspace / ReplicatedStorage.Viewmodels)

Workspace에 무기 원본 모델(compass NEW/LAST, leg_crutch 3/r15/relode, can/cup/toast_test, Silicon Gun Viewmodel, Sillingpom Viewmodel, r15 book/can/compass 등)이 흩어져 있고, 1인칭 뷰모델 리그는 `ReplicatedStorage.Viewmodels` 하위. 3인칭 리깅은 `SharedFX.WeaponRig3P`가 일반화 처리.

## 관련

- [스크립트 인벤토리](./script-inventory.md) · [FEAT-0009 소화기 연막](../../features/FEAT-0009-fire-extinguisher-smoke.md) · [FEAT-0025 그래플](../../features/FEAT-0025-grapple-zipline.md)
