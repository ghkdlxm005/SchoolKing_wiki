---
title: Cup (컵/장판 수류탄)
tags: [weapon, reference, grenade]
---

# Cup — 컵 (장판 수류탄)

던져서 장판(DOT)을 까는 투척류. 지속 피해 + 슬로우.

## 현재 스펙 (최신)

| 항목 | 값 |
| --- | --- |
| 분류 | 수류탄 (Type DOT) |
| 틱당 데미지(DamagePerTick) | **10** |
| 장판 반경 / 지속 | AreaRadius 3.5 / AreaDuration 7s |
| 장판 슬로우 | ~15% (밟는 동안, ServerHandler 적용) |
| 파편(BreakParticleCount) | 60 |
| 쿨다운 | 1s |
| 연출 | 바깥 라인만 빨간 네온 |

> 소스: `GrenadeSystem.GrenadeConfig.Cup` (+ Default 상속). 슬로우 수치는 config 스칼라가 아닌 핸들러 로직값.

## 수정 이력

- **2026-08-04** — 틱당 데미지 5→10, 장판 슬로우 10→15%, 파편 +20%(50→60), 바깥 라인만 빨간 네온으로.
- **2026-08-02** — 결정론적 궤적으로 착탄 프리뷰(링)와 실제 폭발 지점 1:1 일치, 유리벽 깨고 통과([FEAT-0020](../../../features/FEAT-0020-grenade-accuracy-glass.md)), 폭발음 `cup_explode` 배선.
