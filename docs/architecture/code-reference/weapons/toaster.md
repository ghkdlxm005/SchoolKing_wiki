---
title: Toaster (토스터/샷건)
tags: [weapon, reference]
---

# Toaster — 토스터 (샷건)

근거리 샷건. 우클릭 3단 차징. 펠릿은 3×3 격자.

## 현재 스펙 (최신)

| 항목 | 값 |
| --- | --- |
| 분류 | 샷건 (FireMode semi) |
| 공격력 | 8 / 펠릿 (헤드샷 ×1.5) |
| 펠릿 | PelletCount 8 (+중앙 = **3×3, 9발**) |
| 공격속도(FireRate) | 0.1s |
| 탄창 / 예비 | 2 / 24 |
| 재장전 | 2.4s |
| 탄퍼짐(Spread) | 0.05 |
| 최대 사거리 / 낙폭 | 120 / FalloffStart 25 · **FalloffMin 1 (감쇠 없음)** |
| 차징 | 3단계 · ChargeTime 0.6 · ChargedFireRate 0.1 · ChargeRangeMult 2.2 |
| 특수 | 무한탄창 시 좌클릭 홀드 연사 · **발사 시 빵 튀어나옴(상대 시점에도 보임)** |

> 소스: `GunConfig.Toaster`. 사운드 폴더 `toaster`. 빵 연출은 `WeaponEffectsClient`.

## 수정 이력

- **2026-08-06 (차징 3단계 실제 메시)** — 파티클 방식 제거하고 **실제 뷰모델 토스트 단계 메시**를 3인칭에 노출. 발사자 클라가 단계(0/1/2/3)를 `ToasterChargeEvent`로 전송 → 서버 릴레이 → 상대 클라(`WeaponEffectsClient`)가 3인칭 리그 빵(bread_1/2) 위치에 뷰모델의 `ToastStage2`(구운빵)/`ToastStage3`(탄빵) 메시를 리그 빵 크기로 복제·웰드(겹침)하고 단계별 토글. stage1=생빵, stage2=구운빵, stage3=탄빵+불(FireBody의 Fire 파티클), stage0=정리·생빵 복원. Play 검증 완료.
- **2026-08-05 (차징 3단계 상대 노출 — 파티클, 폐기)** — 최초엔 연기/불 파티클로 단계 표현했으나, 실제 뷰모델 메시 방식(위)으로 교체됨.
- **2026-08-05 (모든 총알 궤적 Trail)** — 상대 시점 총알에 Dustpan식 궤적 Trail 추가(일반 `drawTracer`·토스터 총알 공통). Trail Lifetime로 궤적이 잠깐 남았다 사라짐(일반 0.8s·토스터 0.6s), 폭 테이퍼. Play 검증: 총알에 Trail 부착.
- **2026-08-05 (총알 3인칭 가시성)** — 상대 시점 총알이 빵은 보이는데 안 보이던 문제. 원인은 속도(5000 stud/s → 짧은 사거리 1프레임 통과). 상대 클라 총알을 **속도 700 + 최소 비행시간 0.12초 + 잔상 Trail**로 조정해 확실히 보이게(Play 검증: 9발 트레일·수명 ~0.45초). 본인 1인칭 총알(5000)은 그대로.
- **2026-08-05 (총알 상대 노출)** — 상대 시점에 토스터 총알이 안 보이던 것 수정. 서버가 `VisualEffectEvent("GunFire")`에 **펠릿 방향 전체(`pelletDirs`)** 를 실어 보내고, 상대 클라 `WeaponEffectsClient`가 실제 `ReplicatedStorage.GunSystem.ToasterBullet`(스파클 메시)을 **펠릿 수(9)만큼** 총구→낙탄점으로 스폰(BULLET_SPEED 5000, 본인 클라와 동일 연출). 토스터는 일반 네온 트레이서 대신 이 총알 사용. Play 검증: 9발 + 빵 스폰. **봇=플레이어 동일 취급** — BotManager도 토스터 발사 시 3×3 펠릿 9방향을 broadcast해 봇 총알·빵도 동일하게 보임.
- **2026-08-05 (3인칭 이동·액션 애니)** — 3인칭 하반신 포즈 구동부를 ClientHandler에 추가(컴퍼스와 동일한 Heartbeat pose 스위처: Air→Jump, IsSliding→Slide, IsCrouching→CrouchWalk/Crouch, else Idle). 추가 애니: Jump=`133856486486956`, Reload=`119992486150519`, Crouch=`83420952115014`, CrouchWalk=`80168518712624`, Slide=`122957534526278`(Looped/Priority는 컴퍼스 동일 슬롯 복사). Play 검증: 앉기→Crouch, 슬라이딩→Slide, 복귀→Idle 전환 확인.
- **2026-08-05 (3인칭 리그·애니)** — 3인칭 무기 리그 `r15 toaster`를 캐릭터에 부착(ServerHandler에 WeaponRig3P 블록 추가, 기본 Tool 파트 숨김). 3인칭 애니 연결: Idle=`106656977590375`(대기), Equip=`127975230884400`(들기), Fire=`70983246796143`(사격) — `GunSystem.Animations.Toaster.ThirdPerson`. Play 검증: 리그 부착 + Idle 재생 확인. (Aim 슬롯은 ID 미지정=미재생)
- **2026-08-05 (빵 상대 노출)** — 발사 시 나오는 빵이 본인 뷰모델 애니(BreadLeft/BreadRight)뿐이라 상대에겐 안 보이던 것을, 상대 시점에서도 보이게. 서버가 발사 시 브로드캐스트하는 `VisualEffectEvent("GunFire")`에 weapon 정보를 실어, 다른 클라의 `WeaponEffectsClient`가 총구 위치에 실제 빵 메시(`ToasterVM.bread_1`)를 복제·위로 팝(속도 22↑+8앞)시키고 굴리다 1.6초 후 제거. 본인은 기존 뷰모델 빵 그대로(중복 없음).
- **2026-08-04 (3×3 + 무한연사)** — 산포를 "중앙 1 + 팔각형 8"(원형 9발) → **3×3 격자 9발**. 무한탄창 시 좌클릭 홀드로 연사 유지(PC·모바일).
- **2026-08-04 (차지 개편)** — 차지 전구간 발사속도 제한 삭제(ChargedFireRate 1.0→0.1), 발사 간격 0.15→0.1, 차지시간 1.05→0.6, 거리감쇠 삭제(FalloffMin 1.0).
- **2026-07~08** — 토스터 뷰모델/툴 생성, 더블배럴 샷건 config, 우클릭 3단 차징 + 토스트 굽기 + 연기.
