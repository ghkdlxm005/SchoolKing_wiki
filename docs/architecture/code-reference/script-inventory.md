---
title: 스크립트 인벤토리 (91)
sidebar_position: 2
tags: [architecture, reference, snapshot]
---

# 스크립트 인벤토리 — 91개 (2026-08-05)

전체 `Script`/`LocalScript`/`ModuleScript` 목록. 라인수는 규모 감(정확한 실시간 값). 용도는 현재 동작 기준.

## ServerScriptService — 서버 권위 시스템 (23)

| 스크립트 | 줄 | 용도 |
| --- | ---: | --- |
| CapturePointSystem | 411 | 거점 점령전 핵심 — 점수·승리·라운드 리셋·스폰 배분·진행중 참가자 보장 스폰. 초기 Phase=lobby |
| BotManager | 297 | AI 봇 생성·무기 장착·전투·리스폰→거점 이동·봇 점수 |
| MatchmakingService | 267 | 크로스서버 매칭(MemoryStore 큐 → 단일 리더 → 예약서버 배정). Studio는 로컬 폴백 |
| HealHandler | 229 | 서버 힐 — 책(BookCount) 소모, 체력/쉴드 회복, 힐 상태 이벤트 |
| ShieldSystem | 177 | **데미지 단일 진입점** — 쉴드→체력 순 차감, 공격 시 은신 해제. 모든 데미지는 여기 경유 |
| FireExtinguisherSystem | 175 | 소화기 연막 — 파괴·연기(기본 투명, 피격 시 노출)·리스폰. SMOKE_TIME 25, RESPAWN 55 |
| GlassWallSystem | 155 | 파괴 가능한 유리벽(HP50) — 프롬프트·파편·흰 번쩍·재생. 프롬프트 사거리 파트 크기 기반 |
| MonsterEnergySystem | 131 | 아이템 랜덤 능력 — 무한탄창/무한수류탄/은신(각 10초) + 색 파워업 |
| GrenadeDropSystem | 127 | 사망 시 수류탄 드롭 + 근접 획득(+1) |
| CrowdAmbience | 112 | 관중 함성 앰비언스 — crowd_1_fix/crowd_2_fix 랜덤 교차 |
| DeathShatter | 105 | 사망 시 캐릭터 산산조각 연출 |
| SpawnDistributor | 90 | 스폰 지점 분배(겹침 방지) |
| JumpPadSystem | 80 | 점프대 — 좌우 알람 2회(ALARM OFFICAL) 후 발사 |
| DummyCloseShooter | 75 | 연습 더미의 근접 사격 |
| EnvironmentSFX | 72 | 점프대·리프트·부스터·경고등 환경 사운드 |
| DeathRespawnSystem | 56 | 서버 사망→리스폰 제어(CharacterAutoLoads off) |
| LobbySystem | 39 | 로비 게이트 — 예약서버 여부 판별, InLobby 관리 |
| BookHealRig | 33 | 책 힐 아이템 3인칭 리그 부착 |
| StealthSystem | 27 | 은신 상태(Stealth) 관리 |
| SlideSoundServer | 24 | **슬라이드 시작 시** 캐릭터에 sliding 3D 재생(본인+상대). SlideSoundEvent 수신 |
| RespawnSoundServer | 21 | 리스폰 사운드 서버 재생 |
| RegenSystem | 20 | 체력 자연 재생(NoRegen 예외) |
| ShieldSystemInit | 2 | ShieldSystem 초기화 훅 |

## StarterPack — 무기 7종 (각 Client + Server)

각 무기는 **ClientHandler**(입력·1인칭 뷰모델·애니·연출·사운드)와 **ServerHandler**(발사/명중 서버 판정·데미지·탄약 검증)로 구성.

| 무기 | Client 줄 | Server 줄 | 분류 · 특징 |
| --- | ---: | ---: | --- |
| Compass | 3822 | 359 | 자동소총. Run/Tilt·마커 사운드 등 모션 최대 규모 |
| Toaster | 1621 | 309 | 샷건/토스터 — 3×3 펠릿, 우클릭 3단 차징, 무한탄창 연사 |
| SiliconGun | 1593 | 342 | 레이저건 — 연속 빔·램핑(6→12), 피격 슬로우, 창문 2배, 서버 빔 |
| LegCrutch | 1505 | 311 | 돌격소총(목발) — 탄창 27, 재장전 1.2s |
| Dustpan | 615 | 258 | 근접(쓰레받이) — 데미지 50, lunge, 쉴드 기능 삭제됨 |
| Cup | 552 | 550 | 수류탄(컵) — 장판/DOT(틱10·슬로우15) |
| CAN | 548 | 616 | 수류탄(캔) — 폭발형(95, LOS 벽 차폐), 빨강 외곽선 |

> 근접(V키/휘두르기)은 공통으로 `SharedFX.MeleeLunge`(돌진) + `MeleeEvent`(서버 데미지·넉백) 사용.

## StarterPlayer.StarterPlayerScripts — 클라이언트 (40)

| 스크립트 | 줄 | 용도 |
| --- | ---: | --- |
| HealController | 429 | 힐(키4) 입력·시전바·뷰모델. Grappling 중 차단 |
| CustomFPCamera | 362 | 1인칭 커스텀 카메라(FOV·흔들림) |
| MainMenuController | 294 | 메인메뉴/로비 UI·HUD 숨김. DeathScreen 강제표시 안 함(BUG-0026) |
| ScoreHUD | 226 | 점수판·등수 |
| EnemyOutline | 150 | 적 흰색 윤곽선(연막·시선 차폐 시 숨김) |
| GrappleController | 149 | 그래플 집라인(Rope_act 끝-끝 라이드·[E]·스페이스 하차) |
| HandsController | 149 | 맨손 1인칭 |
| SpeedBoostHUD | 129 | 이속 부스트 표시 |
| DamageFeedback | 120 | 피격 방향/화면 피드백 |
| MovementSounds | 121 | 발소리 통일(본인=상대 리그·템포). 슬라이드 소리는 서버가 담당 |
| DamageNumbers | 110 | 데미지 숫자·히트마커(HitFeedbackEvent) |
| MatchFlowHUD | 97 | 매치 흐름(카운트다운 등) |
| MobileControls | 86 | 모바일 터치 버튼(PC 동일 조작) |
| OverheadShield | 77 | 머리 위 쉴드바(피격 직후만 노출) |
| HUDResponsive | 51 | 해상도/기기별 HUD 배치 |
| AnimPreloader | 52 | 애니메이션 프리로드 |
| GazeInteract | 58 | **유리벽/문 시선+근접(12) 상호작용** — 카메라 레이가 파트에 닿고 근접 시 프롬프트 on |
| KillFeed | 48 | 킬로그 |
| ViewmodelWallAvoid | 40 | 뷰모델 벽 관통 방지(retract) |
| Sound3DListener | 30 | 3D 사운드 리스너 |
| ViewmodelCleanup | 32 | 라운드 리셋 시 뷰모델 잔존 정리 |
| FaceCameraLock | 28 | 그래플 등에서 몸을 카메라 방향 고정(무기 사용용) |
| MeleeKnockbackClient | 25 | 근접 피격 시 **피격자 클라가 직접 넉백**(서버 속도 무시 대응) |
| OwnServerLaserHide | 24 | 본인의 __ServerLaser 숨김(LocalTransparencyModifier) |
| RespawnSound | 24 | 리스폰 사운드(클라) |
| KillerReveal | 21 | 사망 시 킬러 투시 |
| DeathSFX | 19 | 사망 효과음 |
| HitSounds | 19 | 명중음 |
| HUDEarlyLoad | 17 | 접속 시 GameHUD 미리 복제(스폰 전 Customize용) |
| SelfShadow | 15 | 본인 그림자 |
| AbilityHUD | 70 | 능력(파워업) 배너/카운트다운 |
| DeathCamController | 152 | 데스캠 시점·UI |

> 이 외 CrosshairController·CaptureHUDBinder는 StarterGui.GameHUD 하위(아래).

## StarterPlayer.StarterCharacterScripts

| 스크립트 | 줄 | 용도 |
| --- | ---: | --- |
| SlideScript | 1134 | **이동 상태머신** — Walk/Run/Crouch/Slide 전환(setState·applyAttributes), 슬라이드 시작 시 SlideSoundEvent 발사 |
| Health | 2 | 기본 체력 스크립트(스텁) |

## StarterGui — UI (4)

| 스크립트 | 줄 | 용도 |
| --- | ---: | --- |
| GameHUD.HUDController | 752 | HUD 총괄 — 로드아웃 창·탄약·Customize 리스너·KEEP_GUI 화이트리스트·중복 폐기 |
| GunUI.GunUIController | 180 | 총기 UI |
| GameHUD.CrosshairController | 49 | 다이내믹 크로스헤어 |
| GameHUD.CaptureHUDBinder | 28 | 거점 점령 HUD 바인딩 |

## ReplicatedStorage — 공유 모듈 (설정·리그·연출)

| 모듈 | 줄 | 용도 |
| --- | ---: | --- |
| GunSystem.GunConfig | 254 | 총기 설정(무기별). [설정값](./config-values.md) |
| GrenadeSystem.GrenadeConfig | 142 | 수류탄 설정 |
| MeleeSystem.MeleeConfig | 110 | 근접 설정 |
| SharedFX.SlideTilt | 145 | 슬라이드/앉기 몸 기울임 |
| SharedFX.WeaponRig3P | 126 | 3인칭 무기 리깅 일반화(R15 팔다리 제외) |
| SharedFX.RunTilt | 116 | 달리기 몸 기울임 |
| SharedFX.ThirdPersonAnims | 115 | 3인칭 애니 로더 |
| ClientSFX | 113 | 클라 사운드 헬퍼 |
| SharedFX.MeleeLunge | 97 | 근접 돌진(대상 탐지 콘 55°·사거리 11·LOS) |
| GunSystem.SpreadState | 31 | 탄퍼짐 상태 |
| GunSystem.Recoil | 29 | 반동 계산 |
| MatchmakingConfig | 16 | 매칭 상수 |

> Viewmodels 하위의 Book_Viewmodel LightConfig(EasyConfiguration/Type/LightConfig)는 서드파티 조명 에셋 스크립트(게임 로직 아님).

## 관련

- [Remote·Bindable 36종](./remotes.md) · [어트리뷰트 66종](./attributes.md) · [설정값](./config-values.md) · [맵·사운드](./map-and-sfx.md)
