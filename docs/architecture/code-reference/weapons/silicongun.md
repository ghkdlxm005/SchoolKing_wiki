---
title: SiliconGun (실링폼/레이저건)
tags: [weapon, reference]
---

# SiliconGun — 실링폼 (레이저건)

연속 레이저 무기. 대상을 계속 조사(照射)할수록 데미지가 램핑된다. 헤드샷 판정 없음.

## 현재 스펙 (최신)

| 항목 | 값 |
| --- | --- |
| 분류 | 레이저 (IsLaser, FireMode auto) |
| 레이저 데미지 | **최소 6 → 최대 13** (RampTime 2s, TickRate 0.1s) |
| 헤드샷 | 없음 (HeadshotMultiplier 1, LimbMultiplier 1) |
| 탄창 / 예비 | 100 / 300 |
| 재장전 | 1.8s |
| 탄퍼짐(Spread) | 0 (레이저) |
| 최대 사거리 | 500 |
| 조준 FOV / 속도 | 55 / 0.12 |
| 특수 | 피격 시 **슬로우 +5**(0.6s) · **창문(유리벽) 데미지 2배** · 무한탄창 시 즉시 최대 데미지 |

> 소스: `GunConfig.SiliconGun` (표시명 "Silicon Gun", Tool은 Sillingpom). 재장전음은 3인칭 애니 마커(`93584166771428`)의 silicon_ready/reload_1/reload_2.

## 수정 이력

- **2026-08-07 (3인칭 리그·애니)** — 3인칭 무기 리그 `r15 Silicon Gun` 부착(ServerHandler에 WeaponRig3P, 기본 Tool 숨김) + 3인칭 애니 연결: Idle(든 상태·사격 공용)=`77656859363450`, Equip=`120873498596475`, Crouch=`72636412962752`, CrouchWalk=`122544208611840`, Slide=`136039630826889`, Jump=`140515096149404`, Run=`128304863322128`, Reload=`105074808089892`(재장전 시 **foam 파트가 튀어오름** — 1인칭과 동일 연출, 애니가 foam 본 구동). Fire 슬롯은 의도적으로 비움(사격=든 상태 유지). ClientHandler에 pose 스위처(Idle/Run/Crouch/CrouchWalk/Slide/Jump) 추가. Play 검증: 리그 부착·Idle 재생·앉기/슬라이드 전환·Reload에서 foam 0.81stud 이동 확인. ※ 재장전 마커 사운드(silicon_ready/reload_1/reload_2)는 마커명 기반 — 새 애니에 마커 없으면 재장전음 미재생이니 실기 확인.
- **2026-08-04 (레이저 동기화)** — 본인에게는 남들용 서버 빔(10Hz·네트워크 지연)을 숨기고(Owner 태그 + `OwnServerLaserHide`) 실시간 클라 빔만 보이게 → 발사와 완전 동기화. 남들은 서버 빔을 봄.
- **2026-08-04 (밸런스/개선)** — 무한탄창 시 램프 무시 즉시 최대 데미지, 피격 슬로우 +5(0.6s), 상대 시점에도 보이는 서버 레이저 빔 추가, 최소/최대 데미지 6/12, 창문 타격 2배.
- **2026-08-04** — [BUG-0023](../../../bugs/BUG-0023-silicon-laser-afterimage.md) 레이저 잔상 잔존 수정(빔을 state에 저장해 하나만 재사용, 정지 0.15s 후 숨김).
- **2026-06** — 뷰모델·레이저·재장전 개편([FEAT-0003](../../../features/FEAT-0003-silicongun-rework.md)), 사격 포즈·연사 부들거림([FEAT-0004](../../../features/FEAT-0004-silicongun-fire-pose.md)).
