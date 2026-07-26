---
title: "FEAT-0014 1인칭 뷰모델 벽 관통 방지"
tags: [feature, viewmodel]
---

# FEAT-0014 — 1인칭 뷰모델 벽 관통 방지 (retract)

| 항목 | 값 |
| --- | --- |
| 상태 | 완료(retract) · BARREL 튜닝 여지 |
| 관련 시스템 | 1인칭 뷰모델, 카메라, 렌더 |
| 날짜 | 2026-07-26 |

## 동작

`ViewmodelWallAvoid`(신규 LocalScript)가 매 프레임:

1. 카메라 전방으로 `WALL_CHECK`(4스터드) 레이캐스트.
2. 벽까지 거리가 `BARREL`(3스터드)보다 가까우면 그만큼 뷰모델을 카메라 쪽으로 당긴다.
3. `SMOOTH`로 부드럽게 보간.
4. 무기 배치(RenderPriority Camera+1) 다음(Camera+3)에 돌아 전 무기에 공통 적용. 무기 코드는 안 건드림.

핵심: 당김은 `Model:PivotTo`로 모델 전체를 옮긴다. 앵커 루트+웰드 구조라 루트 CFrame만 옮기면 렌더에 반영 안 됨 → [LESSON-0007](../lessons/LESSON-0007-viewmodel-wall-clip.md).

## 채택 배경

ViewportFrame(월드 조명·파티클 상실), 모델 축소(FakeCamera 충돌·근접 클리핑)를 모두 시도했으나 다른 요구(실제 조명·그림자·파티클 유지)와 충돌했다. retract만 총을 월드에 둔 채 벽을 막아 유일하게 양립한다. 상세 비교는 [LESSON-0007](../lessons/LESSON-0007-viewmodel-wall-clip.md).

## 캐릭터 그림자

1인칭에서 본인 몸은 숨기되(LocalTransparencyModifier — 그림자엔 영향 없음) 그림자는 지도록 `SelfShadow`(신규)가 캐릭터 파트의 `CastShadow`를 보장하고 `Lighting.GlobalShadows`를 켠다.

## 튜닝

`ViewmodelWallAvoid` 상단 `WALL_CHECK` / `BARREL` / `SMOOTH`. 긴 무기(목발)가 삐져나오면 `BARREL`을 키운다.

## 구현 위치

- `StarterPlayer.StarterPlayerScripts.ViewmodelWallAvoid` (신규)
- `StarterPlayer.StarterPlayerScripts.SelfShadow` (신규)

## 관련

- [LESSON-0007](../lessons/LESSON-0007-viewmodel-wall-clip.md)

## 변경 로그

- 2026-07-26: retract 방식 채택. ViewportFrame·모델 축소 시도 후 폐기. 캐릭터 그림자 보장.
