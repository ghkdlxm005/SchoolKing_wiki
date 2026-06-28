---
title: "FEAT-0003 SiliconGun 뷰모델·레이저·재장전 개편"
tags: [feature, weapon, animation]
---

# FEAT-0003 — SiliconGun 뷰모델 · 레이저 · 재장전 개편

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (2026-06-26) |
| 관련 시스템 | [무기](../architecture/systems/combat/weapon-system.md), [리깅·머즐](../architecture/systems/presentation/viewmodel-rigging.md), [애니메이션](../architecture/systems/presentation/animation-system.md) |

## 왜 (의도)

레이저 무기 정체성 강화: 새 리깅 뷰모델 + 깔끔한 연속 빔.

## 동작 (코드 기준)

### 뷰모델 교체
- 신규 리깅 `SiliconGunVM` (직속 26 / 전체 57 파트), PrimaryPart=HumanoidRootPart, `main` 웰드 앵커.
- 핵심: barrel(머즐), AimPart(ADS), LeftArm/RightArm, FakeCamera, 겹침 튜브 `foam`/`foam 2`(기본 숨김).

### 애니메이션 전용 폴더
- 기존 LegCrutch 폴더 공유 → **`GunSystem.Animations.SiliconGun`** 신설, 핸들러가 이 폴더 참조.
- 등록: Equip `82424620672014`, Reload `90548560652608`, Tilt `116759963207169`, Run `136540259610641`.
- Fire/FireAim = 비움(레이저는 연속 빔). Idle/AimIn/AimOut/Melee 미등록(추후).

### 레이저 효과 정리
- 레이저(틱)일 때 **발당 반동·소리·머즐 네온볼 제거**.
- 소리: **좌클릭 누르는 순간 1회만**(홀드 중 반복 X).
- 빔 시작점: 몸통 중심 → **`barrel` 앞면 끝**에서 출발(카메라 시선과 가장 정렬된 축으로 보정).

### 재장전 잔상 제거
- 원인: 배럴 튜브 `foam`(Mac part)·`foam 2`(Mac part 2)가 정확히 겹쳐 둘 다 표시.
- 해결: 재장전 중 변위 추적 → **더 많이 빠져나간 튜브를 끝에서 숨김**. 평상시 `foam 2` 기본 숨김.

## 변경 로그

- 2026-06-26: 뷰모델 교체, 전용 애니 폴더, 레이저/재장전 정리.
