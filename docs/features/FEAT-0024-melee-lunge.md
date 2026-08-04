---
title: "FEAT-0024 근접공격 돌진(에이펙스식 lunge)"
tags: [feature, weapon, movement]
---

# FEAT-0024 — 근접공격 돌진(에이펙스식 lunge)

| 항목 | 값 |
| --- | --- |
| 상태 | 구현(모션 추후) · 라이브 검증 권장 |
| 관련 시스템 | 근접공격(Dustpan 휘두르기 + 전 무기 V키) |
| 작성일 | 2026-08-04 |

## 개요

에이펙스 레전드식 근접 lunge를 도입. 화면(조준) 정면 근접 사거리 안에 적이 있을 때 근접공격을 하면, 그 적 쪽으로 살짝 **돌진(붙음)** 하면서 **데미지와 넉백이 동시에** 적용된다. 참고: 에이펙스 근접은 30데미지 + 타겟으로 스냅되는 lunge로 간극을 좁힌다.

## 동작

- **대상 탐지(`MeleeLunge.findTarget`)**: 카메라 정면 콘(±55°) + 사거리(11 stud) 안에서, 시야(벽 미차폐)가 확보된 가장 가까운 적(플레이어·봇)을 고른다.
- **돌진(`MeleeLunge.lunge`)**: 대상이 있으면 그쪽으로 `LinearVelocity`를 0.14초 강제해 붙는다(휴머노이드 이동 컨트롤러 저항 무시). 대상과 `STOPGAP`(3.5 stud)만큼 간격을 남겨 겹침 방지.
- **데미지 + 넉백**: 서버가 근접 사거리(11) 안 대상에 데미지 적용과 동시에 대상을 뒤로 넉백(수평 밀림 + 살짝 띄움).
- **적용 무기**: Dustpan(좌클릭 휘두르기), LegCrutch·Compass·SiliconGun·Toaster(V키 근접) 전부.

## 관련 변경

- Dustpan **쉴드(우클릭 방어) 기능 삭제** — 의미가 없어 우클릭 방어 입력 제거(서버 쉴드 코드는 비활성).
- 근접 사거리 확장: Dustpan `SwingRange` 5→11, 총 `MeleeRange` 5→11(돌진 도달거리와 일치).
- 근접 데미지 숫자 표시(HitFeedbackEvent) — [changelog](../changelog.md) 참고.

## 미구현(추후)

- 때리는 모션(1인칭/3인칭 근접 애니메이션)은 추후 추가 예정. 현재는 메커니즘(돌진·데미지·넉백)만 구현.

## 구현 위치

- `ReplicatedStorage.SharedFX.MeleeLunge`(신설) — 대상 탐지 + 돌진
- `StarterPack.Dustpan.ClientHandler`(trySwing 돌진) / `Dustpan.ServerHandler`(넉백)
- `StarterPack.{LegCrutch,Compass,SiliconGun,Toaster}.ClientHandler`(doMelee 돌진) / `ServerHandler`(넉백 + 데미지숫자)
- `MeleeConfig`(SwingRange) · `GunConfig`(MeleeRange)

## 변경 로그

- 2026-08-04: 근접 lunge + 사거리 확장 + 넉백 + Dustpan 쉴드 삭제.
