---
title: "FEAT-0009 소화기(Fire Extinguisher) 연막 시스템"
tags: [feature, map, system]
---

# FEAT-0009 — 소화기 연막 시스템

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 (2026-07-12) |
| 관련 | [무기](../architecture/systems/combat/weapon-system.md), 적 윤곽선(EnemyOutline) 연막 가림 |

## 왜 넣는가 (의도)

맵에 파괴 가능한 소화기를 두고, 부수면 연막이 퍼져 시야를 가리는 전술 요소. 엄폐·진입·이탈 타이밍을 만든다.

## 동작 (코드 기준)

- HP 10: 소화기 모델에 Humanoid(MaxHealth 10)를 붙여 기존 사격 파이프라인(`hit → Model → Humanoid → ShieldSystem.DealDamage`)으로 파괴된다. 자동회복(RegenSystem)·적 윤곽(EnemyOutline)에서는 제외한다(`NoRegen`/`NoOutline` 속성).
- 파괴 연출: HP 0이 되면 캔처럼 살짝 기울인 채 수직축으로 3초 회전한 뒤 사라진다.
- 연막 발동: 가장 가까운 `Workspace.Smoke`(복셀형 반투명 파트 뭉치)를 3초에 걸쳐 서서히 표시하고, 20초 유지한 뒤 다시 3초에 걸쳐 서서히 숨긴다. 평소엔 전부 `Transparency=1`(투명)이다.
- 리스폰: 파괴 30초 후 원위치에 HP 10으로 복구한다.
- 분사 사운드: 파괴(피격) 순간 `Smoke Grenade`(0.5, 3D)를 재생한다.
- 연한 노란 윤곽: 소화기에 옅은 노랑 Highlight를 준다(파괴 상태에선 제거, 리스폰 시 복원).

## 연막 가림 (EnemyOutline 연동)

- `SmokeActive=true`인 연막만 가림 판정에 사용한다. 숨겨진 연막은 시야를 막지 않는다.
- 적이 연막 볼륨 안에 있으면 윤곽을 숨긴다. 단 나도 같은 연막 안이면 서로 보인다.
- 가려질 때는 윤곽뿐 아니라 이름표·체력·머리 위 실드바도 함께 숨는다(`SmokeHidden` 속성).

> 철회된 확장: 한때 나→적 시선 선분이 연막을 통과하면 숨김(둘 다 연막 밖이어도 가림, slab 클립 `segHitsSmoke`)으로 넓혔으나, 원래 판정으로 되돌렸다. 등수별 외곽선 색도 같은 이유(연막 가림 무시)로 철회됐다.

## 구현 위치

- `ServerScriptService.FireExtinguisherSystem` (신규) — HP·회전·페이드·리스폰·사운드.
- `StarterPlayer.StarterPlayerScripts.EnemyOutline` — `SmokeActive` 게이트 + 연막 내부 판정(`inSmoke`), `SmokeHidden` 전파.
- `ServerScriptService.RegenSystem` — `NoRegen` 모델 제외.

## 메모

- `SMOKE_TIME`(20), `RESPAWN_TIME`(30), `FADE_TIME`(3), `SPIN_TIME`(3), `EXT_MAX_HP`(10)로 조절한다.
- 서버 스크립트라 Play 시작 시 초기화된다(연막 숨김·Humanoid 부착).

## 변경 로그

- 2026-07-12: 신규 — HP10·회전·연막 페이드·30초 리스폰·연한 노랑 윤곽·분사 사운드, 선분 기반 연막 가림.
