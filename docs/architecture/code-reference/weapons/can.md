---
title: CAN (캔/폭발 수류탄)
tags: [weapon, reference, grenade]
---

# CAN — 캔 (폭발 수류탄)

던져서 폭발하는 투척류. 넓은 반경·강한 넉백.

## 현재 스펙 (최신)

| 항목 | 값 |
| --- | --- |
| 분류 | 수류탄 (Type Explosion) |
| 폭발 데미지 | **95** (최소 40) |
| 폭발 반경 | 20 |
| 넉백 | 130 |
| 도화선(FuseTime) | 3s |
| 착지 | LandBounces 2 · 착지 스핀 연출 |
| 파편(BreakParticleCount) | 80 |
| 특수 | 벽 뒤 대상 차폐(LOS) · 빨강 외곽선(연막·벽 투과 표시) |

> 소스: `GrenadeConfig.CAN` (+ Default 상속). 사운드 폴더 `can`.

## 수정 이력

- **2026-08-04** — 음량 +30%, 빨강 외곽선(연막·벽 투과 시 위치 표시).
- **2026-08-04** — [BUG-0022](../../../bugs/BUG-0022-can-explosion-wall-penetration.md) 폭발이 벽 통과해 데미지 → 폭발점→대상 LOS 레이캐스트로 솔리드 벽 차폐 시 데미지 차단(유리벽은 관통 허용).
- **2026-08-02** — CAN을 Cup 기준으로 동작 통일(투척·착탄·유리벽 관통).
