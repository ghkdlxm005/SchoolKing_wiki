---
sidebar_position: 1
title: 무기 시스템 (Weapon System)
tags: [system, weapon, ammo]
---

# 무기 시스템 (Weapon System)

구현 기준(2026-06-05 코드 분석). 스탯은 모두 `GunConfig` / `GrenadeConfig` / `MeleeConfig` 에 있다.
구조·통신은 [코드 구조](../../code-structure.md) 참고.

## 총기 (GunSystem / GunConfig)

| 무기 | 컨셉 | 데미지 | 탄창/예비 | 재장전 | 발사 | 비고 |
| --- | --- | --- | --- | --- | --- | --- |
| **Compass** | 시작 무기·3점사 | 22 (헤드 2.0x) | 15 / 350 | 1.51s | **burst 3 고정**(전환불가) | 사거리 400 |
| **LegCrutch** | 자동 라이플 | 18 (헤드 1.8x) | 30 / 240 | 2.2s | auto ~13rps | 사거리 450, 2x 줌 |
| **Toaster** | 더블배럴 샷건 | **펠릿당 8** (헤드 1.5x) | 2 / 24 | 2.4s | semi | 사거리 120, 3단계 차지. **탄착군 9펠릿**(중앙1+팔각형8)=전탄 72 |
| **SiliconGun** | 레이저(램핑) | 틱 3→9 (2초 램프) | 100 에너지 / 300 | 1.8s | auto | 헤드 없음, 사거리 50. **빔=barrel 앞면 끝, 소리 1회** ([FEAT-0003](../../../features/FEAT-0003-silicongun-rework.md)) |

**Default 공통값**: 데미지 25, 헤드 2.0x, 팔다리 0.7x, 근접(V) 40·사거리 5·쿨 0.8s, 발사모드 B키 전환.

## 수류탄 (GrenadeSystem / GrenadeConfig)

| 무기 | 타입 | 효과 | 핵심 수치 |
| --- | --- | --- | --- |
| **Cup** | 장판(DOT) | 깨진 자리에 지속 피해 영역 | 반경 10, 7초, 틱당 5 (DPS 10) |
| **CAN** | 폭발(세열) | 3초 신관 후 광역 폭발 | 반경 20, 중심 95 / 끝 40, 넉백 130, 쿨 5s |

→ 기능 문서: [FEAT-0001 CAN 세열 수류탄](../../../features/FEAT-0001-grenade-fragmentation.md), [FEAT-0002 Cup 장판](../../../features/FEAT-0002-mug-puddle-grenade.md)

## 근접 (MeleeSystem / MeleeConfig)

| 무기 | 컨셉 | 휘두르기 | 방패(막기) |
| --- | --- | --- | --- |
| **Dustpan & Brush** | 검+방패 | 18 데미지, 사거리 5, 쿨 0.4s | 내구 80, 재생 20/s(4초 대기), 차단각 110° |

**Default**: 휘두르기 25·사거리 6·차단각 90°, 방패 100HP·재생 25/s. 방패 올리면 이동속도 0.7x.

## 입력 → 출력

- 좌클릭 발사 / 우클릭 조준(ADS)·차지 / R 재장전 / B 발사모드 / V 근접
- 입력은 ClientHandler → RemoteEvent → ServerHandler가 판정 → 데미지는 [ShieldSystem](./combat-damage-system.md)

## 리깅 · 머즐(레이저 발사 지점)

무기 모형 조립(리깅)과 레이저/총알이 나가는 위치는 → [뷰모델 리깅 · 머즐](../presentation/viewmodel-rigging.md).
- 애니메이션 클립 구성: [애니메이션 세트](../presentation/animation-system.md)
- 구현 방식·컨벤션: [구현 방식](../foundation/implementation-conventions.md)


## 새 무기 추가 방법

1. 해당 Config(Gun/Grenade/Melee)에 `setmetatable({...}, {__index = Default})` 블록 추가
2. `Viewmodels/`에 뷰모델, `StarterPack/`에 Tool(Client/ServerHandler) 추가
3. 필요 시 `Animations/`, `Sounds/` 추가

#system #weapon
