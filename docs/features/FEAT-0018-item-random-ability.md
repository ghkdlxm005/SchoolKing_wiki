---
title: "FEAT-0018 아이템 랜덤 능력 시스템"
tags: [feature, system]
---

# FEAT-0018 — 아이템 랜덤 능력 시스템

| 항목 | 값 |
| --- | --- |
| 상태 | 완료 |
| 관련 시스템 | 픽업(Monster Energy), 무기, 이동, HUD |
| 구현 위치 | `ServerScriptService.MonsterEnergySystem`, `StarterPlayerScripts.AbilityHUD`(신규), `ServerScriptService.StealthSystem`(신규) |
| 통신 | `AbilityEvent`, `EquipGrenadeEvent`, `CombatRevealEvent` |
| 날짜 | 2026-08-02 |

## 왜 넣는가 (의도)

기존 Monster Energy 픽업 효과는 "이속 +10 후 반동 감소"라는 밋밋한 버프였다. 이걸 없애고, 먹을 때마다 **3종 중 하나가 랜덤으로 10초간** 부여되는 능력 시스템으로 바꿔 픽업의 기대감과 전투 변수를 늘린다.

## 동작

먹으면 `MonsterEnergySystem.grant`가 이전 능력을 정리하고 3종 중 하나를 뽑아 캐릭터 어트리뷰트로 켠다. `Ability` 어트리뷰트에 현재 능력 이름을 넣고, 10초 뒤 토큰이 유효하면 전부 해제한다(중첩 픽업 시 이전 것 무효화).

### 능력 1 — 무한 탄창 (INFINITE AMMO)

10초간 탄약이 닳지 않는다. 서버·클라이언트 양쪽에서 `InfiniteAmmo` 어트리뷰트가 켜진 동안 탄 차감을 막는다(남은 탄 유지). HUD 탄약 표시는 이 동안 `∞`로 바뀐다.

### 능력 2 — 무한 수류탄 (INFINITE GRENADES)

먹는 즉시 투척류를 장착(`EquipGrenadeEvent`)하고, 10초간 개수 제한 없이 던진다(`InfiniteGrenade` 어트리뷰트가 개수 차감·차단을 우회). 던지기 배속 1.2배.

### 능력 3 — 은신 (STEALTH)

10초간 캐릭터의 모든 파트를 투명화하고(`StealthSystem`) 적 윤곽선(`EnemyOutline`)·이름표를 끈다. 대신 남이 듣는 발소리는 증폭된다(`MovementSounds`에서 은신 캐릭터의 발소리 트랙 볼륨 ×2.4).

- **공격 시 해제**: 은신 중 공격이 적중하면(`ShieldSystem.DealDamage`) 은신이 풀리고 `StealthDmgBuff`가 3초 걸린다.
- **데미지 버프**: `StealthDmgBuff` 동안 데미지 2배(몸통도 헤드샷급으로 근사).

## 픽업 이동속도

능력 종류와 무관하게, 아이템을 먹으면 지속시간 동안 **기본 이속 +5, 슬라이딩 이속 +10**이 붙는다(`SpeedBonus=5`, 슬라이딩은 `SlideBoostBonus`). 능력 종료·사망 시 0으로 복귀.

## 파워업 연출 (1인칭)

`AbilityHUD`가 발동 순간을 능력 색으로 연출해 "쎄졌다"는 느낌을 준다.

- 화면 중앙 아래 **큰 배너**(능력 이름), 능력 색 카운트다운 바.
- 화면 전체 **색 플래시** + 좌·우 **가장자리 글로우**(펄스).
- 픽업 사운드.
- 능력별 색: 무한 탄창 금색, 무한 수류탄 주황, 은신 하늘색.

## 튜닝

`MonsterEnergySystem` 상단 `ABILITY_DUR`(10), `ABILITIES` 목록. 이속은 `SpeedBonus`(5)와 `SlideScript.Config.SlideBoostBonus`(10). 은신 발소리 증폭은 `MovementSounds`의 배율(2.4). 색·배너 크기는 `AbilityHUD`.

## 변경 로그

- 2026-08-02: 신규. 이속 버프를 3종 랜덤 능력(무한탄창·무한수류탄·은신)으로 교체, 파워업 연출, 픽업 이속 +5/슬라이딩 +10, 무한탄창 `∞` 표시.
