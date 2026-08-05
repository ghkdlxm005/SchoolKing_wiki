---
title: 어트리뷰트 (66)
sidebar_position: 4
tags: [architecture, reference, snapshot]
---

# 캐릭터/플레이어 어트리뷰트 — 66개 (2026-08-05)

스크립트들이 `SetAttribute`/`GetAttribute`로 읽고 쓰는 상태 플래그. **시스템 간 통신은 상당수가 이 어트리뷰트를 통해** 이뤄진다(늦은 접속·상태 재확인에 강함 — [LESSON-0010](../../lessons/LESSON-0010-late-join-state.md)). 별도 표기 없으면 캐릭터 또는 Player에 붙는다.

## 이동 · 상태

| 이름 | 의미 |
| --- | --- |
| IsSliding | 슬라이드 중(SlideScript가 세팅, 슬라이드음·틸트 트리거) |
| IsCrouching | 앉기 중(SlideTilt가 포즈 적용) |
| IsRunning | 달리기 의도 |
| IsRunState | 달리기 '상태'(발소리 게이트용, 뷰모델 showRun과 분리) |
| Grappling | 그래플 탑승 중(힐 차단·이동 제어) |
| Frozen | 이동 잠금 |
| BaseWalkSpeed | 기준 이동속도 |
| SpeedBonus | 이속 보너스(픽업 등) |
| SlowAmount | 슬로우 누적(실리콘 피격 등) |
| FovBonus | FOV 보정 |

## 전투 · 무기

| 이름 | 의미 |
| --- | --- |
| Ammo / AmmoReserve | 현재 탄창 / 예비 탄약 |
| InfiniteAmmo | 무한탄창 능력(즉시최대·연사 허용) |
| InfiniteGrenade | 무한수류탄 능력 |
| ThrowCount | 보유 수류탄 수 |
| Stealth | 은신 중(은닉, 공격 시 해제) |
| StealthDmgBuff | (삭제됨) 은신 데미지 2배 — 현재 데미지 로직에서 미적용 |
| LastWeapon | 마지막 사용 무기 |
| LastAttacker / LastAttackAt | 마지막 공격자 / 시각 |
| LastCombatAt / LastDamage | 마지막 교전 시각 / 피해량 |
| Aiming | 조준 중 |
| AimAssist | 에임어시스트(모바일) |
| ScouterMagnification | (구)스카우터 배율 |

## 체력 · 쉴드 · 힐

| 이름 | 의미 |
| --- | --- |
| Shield / MaxShield | 현재 쉴드 / 최대 쉴드 |
| ShieldHitAt | 쉴드 피격 시각(머리 위 바 노출 트리거) |
| Healing | 힐 진행 중 |
| NoRegen | 재생 차단 |
| Invincible | 무적(리스폰 직후 등) |
| BookCount / BookVariant | 힐 책 수 / 종류 |
| SnackAmount | 스낵(자원) |

## 스폰 · 매치 · 로비 · 능력

| 이름 | 의미 |
| --- | --- |
| InLobby | 로비 상태(true면 스폰 제외) |
| InZone | 거점 안 |
| Score | 점수 |
| SpawnAt | 스폰 지점 지정 |
| Queued | 매칭 큐 등록 |
| MatchFillBots | 봇 채우기 여부 |
| RequestCustomize | Customize 창 요청 |
| MenuOpen | 메뉴 열림 |
| Ability | 활성 능력 종류 |
| DeadCam | 데스캠 활성(사망 상태 신뢰 소스) |

## 봇

| 이름 | 의미 |
| --- | --- |
| BotWeapon | 봇 무기 |
| BotFire / BotHit / BotDamage | 봇 발사 / 명중 / 피해 신호 |

## 연막 · 유리 · 윤곽선

| 이름 | 의미 |
| --- | --- |
| SmokeActive | 연막 활성(소화기 피격 시) |
| SmokeHidden | 연막에 가려 은닉됨 |
| GlassWrapped | 유리 래핑 상태 |
| NoOutline | 윤곽선 제외 |
| OrigTransparency | 원본 투명도 저장(연막 파트 복원용) |

## 리깅 · HUD · 내부

| 이름 | 의미 |
| --- | --- |
| WR3P | 3인칭 무기 리그 마킹(WeaponRig3P) |
| Owner | 소유자 UserId(서버 레이저 빔 등) |
| HUDResp | HUD 반응형 상태 |
| __HUDActive | HUD 중복 방지 플래그(HUDController) |
| SfxBound | 사운드 바인딩 완료 |
| Looped / Priority | 사운드/처리 보조 |
| _GrapplePrompted | 그래플 프롬프트 생성 완료 |
| _baseVol | 원본 볼륨 저장 |
| _silSlowSess | 실리콘 슬로우 세션 |
| _stOrig | 상태 원본 저장 |
| uid | 고유 식별자 |

> `StealthDmgBuff`처럼 이름은 남아있어도 로직상 폐기된 것이 있으니, 값 존재 = 동작이 아니다. 실제 사용처는 해당 시스템 스크립트에서 확인.

## 관련

- [스크립트 인벤토리](./script-inventory.md) · [Remote·Bindable](./remotes.md) · [LESSON-0010 늦은 접속 상태](../../lessons/LESSON-0010-late-join-state.md)
