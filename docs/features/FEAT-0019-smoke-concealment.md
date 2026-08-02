---
title: "FEAT-0019 연막 은폐 (시선 차단)"
tags: [feature, map, ui]
---

# FEAT-0019 — 연막 은폐 (시선 차단)

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 |
| 관련 시스템 | 소화기 연막([FEAT-0009](./FEAT-0009-fire-extinguisher-smoke.md)), 적 윤곽선, 쉴드 표시 |
| 구현 위치 | `StarterPlayerScripts.EnemyOutline`, `StarterPlayerScripts.OverheadShield`, `ServerScriptService.ShieldSystem` |
| 통신 | `CombatRevealEvent`(신규) |
| 날짜 | 2026-08-02 |

## 왜 넣는가 (의도)

소화기 연막([FEAT-0009](./FEAT-0009-fire-extinguisher-smoke.md))이 시야를 실제로 가리게 한다. 연막 너머의 적은 윤곽선·이름표·쉴드가 보이지 않아야 은폐가 전술적으로 의미가 있다.

## 은폐 규칙

한 문장: **내 시선(카메라 → 적)이 연막을 지나면 그 적은 숨긴다.** 이 한 규칙이 세 경우를 모두 덮는다.

- 적이 연막 안에 있을 때 (시선 끝점이 연막 안)
- 적과 나 사이에 연막이 낄 때 (사람–연막–사람)
- 내가 연막 안에서 밖을 볼 때 (시선 시작점이 연막 안)

숨길 때는 윤곽선(`EnemyOutline`)·기본 이름표(`DisplayDistanceType=None`)·머리 위 쉴드바(`SmokeHidden` 어트리뷰트로 `OverheadShield` 연동)를 함께 끈다.

## 판정 방식 — 구체 + 시선 차단

연막은 `MeshType.Sphere`(Scale 15~30) 파트 약 360개가 겹쳐 만든 큰 구름이다. **판정은 실제 시각과 맞아야** 하므로:

- 각 파트를 **구체**(중심 = 파트 위치, 반경 = `Size × Scale ÷ 2`)로 캐시한다(연막은 안 움직이므로 1회).
- 은폐 판정은 **시선 선분(카메라→적)이 어떤 구체를 지나는가**를 선분–구체 교차로 계산한다.
- 활성 연막은 `SmokeActive` 어트리뷰트, 또는 파트가 실제로 보이면(투명도 < 0.9) 활성으로 본다(폴백).

> 왜 박스(AABB)가 아니라 구체인가는 [LESSON-0009](../lessons/LESSON-0009-hitbox-vs-visual.md) 참고. AABB는 이 뭉게구름을 담지 못했다(코어만 쓰면 가장자리 적을 놓치고, 시각 전체를 쓰면 멀리 선 관찰자까지 포함).

## 전투 노출

연막으로 안 보여도, **때리거나 맞은 상대와는 서로 잠깐 보인다.** `ShieldSystem.DealDamage`가 데미지마다 공격자·피격자 양쪽 클라이언트에 상대 캐릭터를 `CombatRevealEvent`로 보내고, `EnemyOutline`은 노출 시간(2.5초) 동안 그 상대에 한해 연막 판정을 무시한다. 교전이 이어지면 매 타격마다 갱신된다.

## 쉴드 표시 연동

머리 위 쉴드바는 평소 숨겨지고 **피격 직후에만** 잠깐 뜬다(`ShieldSystem`이 `ShieldHitAt` 기록 → `OverheadShield`가 최근 피격 + 연막 미가림일 때만 노출). 즉 원거리에서는 외곽선만, 맞을 때만 쉴드가 보인다.

## 튜닝

`EnemyOutline`의 구체 반경 여유(+2), 전투 노출 시간(`ShieldSystem`의 2.5초), 쉴드바 노출 시간(`OverheadShield`의 `SHOW_TIME` 3초).

## 변경 로그

- 2026-08-02: 신규. 시선 차단 기반 연막 은폐(구체 판정), 전투 노출(2.5초), 쉴드바 피격 시에만 노출.
