---
title: "FEAT-0017 파괴 가능한 유리벽"
tags: [feature, map]
---

# FEAT-0017 — 파괴 가능한 유리벽

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 |
| 관련 시스템 | 맵 오브젝트, 무기 피해 |
| 구현 위치 | `ServerScriptService.GlassWallSystem`(신규) |
| 날짜 | 2026-08-02 |

## 개요

`glass wall` 파트를 무기로 부술 수 있게(HP 70) 하고, 부서지면 파편·사운드·연출과 함께 20초 뒤 서서히 재생한다.

## 피해 받기

무기 피해는 Humanoid 대상으로만 흐르므로, 유리벽 파트를 Model+Humanoid로 감싼다(소화기와 동일 패턴).

- 킬 점수 누수 방지: 실제 MaxHealth를 `70 + 100000`으로 두고, **누적 피해가 70 이상이면(체력이 오프셋 밑)** 파괴한다. 체력이 0에 닿지 않아 `Died`가 안 떠서 유리벽 파괴가 킬로 집계되지 않는다.
- `NoOutline` 어트리뷰트로 적 윤곽선(EnemyOutline) 중복 방지(자체 흰 윤곽선 사용).

## 연출

- **흰색 윤곽선** 상시(Highlight, OutlineColor 흰색).
- **피격 시 흰색 번쩍**(Highlight 흰 fill 순간 노출).
- **파괴 파편** — 반사되는 유리 조각 16개가 튀어 흩어짐(SmoothPlastic + Reflectance, 2초 후 소멸).
- **파괴 사운드** — `SFX.object.OG glass break sound`.
- **재생** — 20초 후, 투명→원래 투명도로 0.6초 페이드인(즉시 생성 X).

## 튜닝

`GlassWallSystem` 상단 `HP`(70) / `RESPAWN`(20) / `FADE_IN`. 이름이 `glass wall`인 파트면 자동 적용(런타임 추가분도).

## 변경 로그

- 2026-08-02: 신규. HP50·파편·흰 윤곽선·피격 번쩍·20초 페이드인 재생·파괴음.
- 2026-08-02: HP 50 → 75 → 70으로 조정.
