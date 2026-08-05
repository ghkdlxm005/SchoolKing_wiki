---
title: 설정값 스냅샷 (무기·수류탄·근접·매칭)
sidebar_position: 5
tags: [architecture, reference, snapshot, weapon]
---

# 설정값 스냅샷 — 2026-08-05

`require()`로 뜬 실제 값의 **집계 스냅샷**. 각 무기는 아래 값 + `Default`(누락 시 상속)로 동작.

> 무기 하나하나의 최신 스펙·수정 이력은 **[무기별 문서](./weapons/index.md)** 가 정본이다. 이 페이지는 한눈에 비교용.

## GunConfig (ReplicatedStorage.GunSystem.GunConfig)

### Default (모든 총이 상속하는 기본값 — 주요 항목)

Damage 25, FireRate 0.15, FireMode auto, MagazineSize 12, MaxReserveAmmo 60, MaxRange 500, Spread 0.02, ReloadTime 1.51, HeadshotMultiplier 1.5, LimbMultiplier 0.7, DefaultFOV 70, AimFOV 40.
근접: **MeleeRange 11**, MeleeDamage 40, MeleeArc 90, MeleeCooldown 0.8.
낙폭: FalloffStart 80, FalloffMin 0.4. 산포: MoveSpreadMult 1.8, AirSpreadMult 2.6.
반동: RecoilVertical 0.00366, RecoilHorizontal 0.00524, RecoilProgressive 0.00065, RecoilProgressiveMax 8, RecoilRecoverSpeed 8.
레이저(공용): LaserEnabled true, LaserThickness 0.04. 연출: TracerEnabled true, MuzzleFlashEnabled true.

### 무기별 (Default 대비 오버라이드)

| 무기 | Damage | FireRate | Mag/Reserve | Reload | Spread | FireMode | 특기 |
| --- | ---: | ---: | --- | ---: | ---: | --- | --- |
| Compass | 22 | 0.045 | 15 / 350 | 1.51 | 0.009 | auto | BurstCount 3·BurstDelay 0.06·**BurstCooldownMult 1**, HeadshotMult 1.5 |
| LegCrutch | 18 | 0.077 | **27** / 240 | **1.2** | 0.012 | auto | BurstCooldownMult 2, AimFOV 38 |
| SiliconGun | 8 | 0.09 | 100 / 300 | 1.8 | 0 | auto | **IsLaser**, LaserMinDmg 6·LaserMaxDmg 12·LaserRampTime 2·LaserTickRate 0.1, HeadshotMult 1(헤드판정 없음) |
| Toaster | 8 | 0.1 | 2 / 24 | 2.4 | 0.05 | semi | **PelletCount 8**(+중앙=3×3 9발), Charge 3단·ChargeTime 0.6·ChargedFireRate 0.1·ChargeRangeMult 2.2, FalloffStart 25·**FalloffMin 1**(감쇠 없음), MaxRange 120 |

> Toaster의 3×3는 코드상 "중앙 1 + 8"(PelletCount 8)이 격자 배치로 뿌려지는 구조. SiliconGun은 `Spread 0`(레이저), 데미지는 램핑(LaserMin→Max, RampTime 2s).

## GrenadeConfig (ReplicatedStorage.GrenadeSystem.GrenadeConfig)

### Default (주요 항목)

Type DOT, Cooldown 1, ExplosionDamage 80·MinDamage 20·Radius 12·Knockback 80, DamagePerTick 3, AreaRadius 8·AreaDuration 5·AreaTickRate 0.5·AreaVisible false·AreaTransparency 0.7, ThrowForce 140·ThrowUpwardBoost 14, BreakParticleCount 200, TrajectoryPoints 40.

### 종류별

| 수류탄 | Type | 핵심 값 |
| --- | --- | --- |
| CAN | Explosion | ExplosionDamage **95**·MinDamage 40·Radius 20·Knockback 130, FuseTime 3, LandBounces 2·착지 스핀 연출, BreakParticleCount 80 |
| Cup | DOT | **DamagePerTick 10**, AreaRadius 3.5·AreaDuration 7, BreakParticleCount 60 |

## MeleeConfig (ReplicatedStorage.MeleeSystem.MeleeConfig)

### Default (주요 항목)

SwingDamage 25, SwingRange 6, SwingArc 90, SwingCooldown 0.5, SwingDuration 0.4, SwingDelay 0.15, CanHitMultiple true, EquipAnim rbxassetid://70934603796055.
쉴드 관련 필드(ShieldMaxHP 100 등)는 **남아있으나 Dustpan 쉴드 삭제로 실사용 안 함**.

### Dustpan

DisplayName "Dustpan & Brush", **SwingDamage 50**, **SwingRange 11**, SwingArc 100, SwingCooldown 0.4, SwingDuration 0.35, SwingDelay 0.12.

> 근접 사거리 11 = 총 MeleeRange 11 = MeleeLunge 돌진 도달거리와 일치([FEAT-0024](../../features/FEAT-0024-melee-lunge.md)).

## MatchmakingConfig (ReplicatedStorage.MatchmakingConfig)

| 상수 | 값 | 의미 |
| --- | ---: | --- |
| MIN_PLAYERS / MAX_PLAYERS | 2 / 8 | 매치 인원 |
| WAIT_TIME | 20 | 대기 시간 |
| GATHER_TIME | 4 | 모집 시간 |
| MATCH_MAXTIME | 600 | 매치 최대 시간 |
| QUEUE_NAME / ASSIGN_NAME | SchoolKingMatchQueue_v1 / SchoolKingMatchAssign_v1 | MemoryStore 키 |
| QUEUE_EXPIRE / ASSIGN_EXPIRE | 300 / 120 | 만료(초) |
| LEADER_TTL / POLL_INTERVAL | 12 / 3 | 리더 TTL / 폴링 |
| QUEUE_INVIS | 15 | 큐 비가시 시간 |

## 관련

- [무기 시스템](../systems/combat/weapon-system.md) · [스크립트 인벤토리](./script-inventory.md)
