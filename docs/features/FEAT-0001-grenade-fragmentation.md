---
title: "FEAT-0001 CAN 세열 수류탄"
tags: [feature, weapon, combat]
---

# FEAT-0001 — CAN 세열 수류탄 (Explosion)

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (코드 확인 2026-06-05) |
| 구현 위치 | `StarterPack/CAN`(Tool: Client/ServerHandler), `GrenadeSystem/GrenadeConfig.CAN` |
| 관련 시스템 | [무기](../architecture/systems/combat/weapon-system.md), [전투](../architecture/systems/combat/combat-damage-system.md) |

## 왜 (의도)

탄산캔 컨셉의 즉시 폭발형 투척으로 한타·지역 견제 변수를 만든다.

## 동작 (코드 기준)

- 타입 `Explosion`, **신관(FuseTime) 3초** 후 폭발
- 폭발 반경 **20**, 중심 데미지 **95** → 반경 끝 최소 **40**, 넉백 **130**
- 투사체: 원통(탄산캔), 밀도 4.0·마찰 0.85로 잘 안 굴러감
- 쿨다운 **5초**(강력 무기)

## 변경 로그

- 2026-02: 기획 등록
- 2026-06-05: 코드 분석으로 실제 수치 반영(반경 20 / 95→40 / 신관 3초)
- 2026-06-26: 임시 뷰모델 `CANVM`(CupVM 베이스+can 메쉬 0.05배) 적용. 쉴드 우선 데미지로 수정([BUG-0002](../bugs/BUG-0002-can-shield-bypass.md)).
