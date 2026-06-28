---
title: "FEAT-0002 Cup 장판 수류탄"
tags: [feature, weapon]
---

# FEAT-0002 — Cup 장판 수류탄 (DOT)

| 항목 | 값 |
| --- | --- |
| 상태 | 구현됨 (코드 확인 2026-06-05) |
| 구현 위치 | `StarterPack/Cup`, `GrenadeSystem/GrenadeConfig.Cup` |
| 관련 시스템 | [무기](../architecture/systems/combat/weapon-system.md) |

## 왜 (의도)

깨진 유리컵 자리에 지속 피해 장판을 만들어 지역 장악·동선 차단.

## 동작 (코드 기준)

- 타입 `DOT`(장판), 반경 **10**, 지속 **7초**, 틱당 **5**(약 DPS 10)
- 깨진 유리 파편 자체가 위험 지대(파편 데미지 반경 2)
- 던진 뒤 쿨다운 3초(Default)

## 변경 로그

- 2026-02: 기획 등록
- 2026-06-05: 코드 분석으로 실제 수치 반영(반경 10 / 7초 / 틱 5)
