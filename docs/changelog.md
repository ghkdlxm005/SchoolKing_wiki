---
title: " 변경 이력 (Changelog)"
sidebar_position: 9
slug: /changelog
tags: [overview]
---

# 변경 이력 (Changelog)

코드·시스템·문서의 **의미 있는 변경**을 최신순으로 기록한다. 핵심은 **무엇을 / 왜** 바꿨는지다.

> 자동 기록: 각 문서 하단의 **"마지막 수정"** 날짜는 Git 이력에서 자동으로 표시된다(누가·언제).
> 이 페이지는 그중 **굵직한 변경**만 사람이 골라 남기는 곳이다.

## 작성 규칙

- 한 줄 형식: `YYYY-MM-DD — [무엇을 바꿨나] — 왜 / 관련(FEAT/BUG/시스템)`
- 코드 변경은 관련 [기능](./features/index.md)·[버그](./bugs/index.md) 문서로 링크
- 큰 변경은 별도 FEAT/BUG 문서를 만들고 여기엔 한 줄 요약만

---

## 2026-07

### 2026-07-23

- **R15 슬라이딩 벽 통과 수정** — R15 전환 부작용 3종(몸통 충돌 꺼짐 / 물리 루트 매프레임 텔레포트 / LinearVelocity 고force 관통). 몸통 충돌 유지 + 텔레포트→속도 스냅 + 전방 벽 감지로 해결 — [BUG-0015](./bugs/BUG-0015-r15-slide-wall-clip.md)
- **관중 처치/사망 사운드 재배치** — `audience Back` → **`audience A·B`**. 처치 `kill_crowd`는 전원 3D(서버), 사망 `death_crowd`는 본인만 3D(클라). Back의 kill/death 재생 제거 — [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **발소리 튜닝** — 내 발소리 2D 유지, **상대 달리기 템포 1.3배**. 달리기 가속 구간에 걷기 소리가 섞이던 것(`IsRunState` 분리) 수정
- **힐(쉴드) 취소 조건 축소** — 앉기(Ctrl)로 끊기던 것 제거, **달리기(Shift)만** 취소
- **콘솔 정리** — Hoop Fever 어트랙트 스크립트 비활성화로 `Attract2`/`AttractFlashLight` 반복 에러 제거

- **2026-07-19** — **R6 → R15 전환**: 아바타 타입 R15 고정 결정(플레이어 선택 미사용), 피격 판정은 유지. 리그 의존 스크립트 3곳(SlideScript·DummyCloseShooter·목발 3인칭 웰드) R15 대응. 애니메이션·오프셋 재작업 대기 — [FEAT-0013](./features/FEAT-0013-r6-to-r15-migration.md)
- **2026-07-19** — 관중 배경 함성(`crowd_1`/`crowd_2` 50% 교대)을 `audience Back`에서 **3D로** 방출하도록 이동 — [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **2026-07-19** — **라운드 종료 리셋 개편**: 위치만 옮기던 것을 `LoadCharacter()`로 바꿔 **부활과 동일하게** 체력·쉴드·탄약·회복 아이템·버프를 전부 초기화. `SpawnDistributor`가 라운드 시작 배치를 덮어쓰지 않도록 가드 추가
- **2026-07-19** — **뷰모델 잔존 버그 수정**: 라운드 리셋 시 무기 뷰모델이 제자리에 남던 문제. 무기 7종에 정리 훅 + `ViewmodelCleanup` 안전망 — [BUG-0012](./bugs/BUG-0012-viewmodel-left-behind.md)
- **2026-07-19** — **컴퍼스 애니 마커 사운드 13개가 한 번도 재생되지 않던 문제 수정**(경로 오류 + nil 가드의 조용한 실패). 마커 바인딩을 전 트랙으로 확대하고 **옛 3D 경로·죽은 에셋 제거** — [BUG-0013](./bugs/BUG-0013-compass-marker-sound-path.md)
- **2026-07-19** — **관중 정비**: 윤곽선 미제외 799명 태그, 관중석 9곳 중 2곳에서만 나던 함성을 전수 재생으로 수정 — [BUG-0014](./bugs/BUG-0014-audience-outline-and-ambience.md)
- **2026-07-19** — 사운드 **전수 점검 방식 도입**(`PreloadAsync` + `TimeLength`). 고유 59개 중 **로드 실패 0건** 확인 — [LESSON-0005](./lessons/LESSON-0005-silent-failure.md)
- **2026-07-19** — **등수별 캐릭터 외곽선 색 철회** — 1위 금색 외곽선이 연막 가림 판정을 무시하고 계속 보여, 외곽선은 흰색 단일로 환원. 연막 가림도 선분 교차 판정에서 **원래 판정(적이 연막 안이면 숨김)** 으로 되돌림 — [FEAT-0009](./features/FEAT-0009-fire-extinguisher-smoke.md)
- **2026-07-19** — **사운드 개편**: 처치 `kill`(내 몸)+`kill_crowd_1/2`(관중석), 사망 `die`+`death_crowd`, 라운드 종료 `victory`(전원), 관중석 A↔B **50% 겹침 교대 앰비언스**(`crowd_1`/`crowd_2`) 신규. 재생 위치·청취 대상을 `ClientSFX` 모듈로 통합 — 전투 피드백 강화 · [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **2026-07-19** — 스폰 시 캐릭터가 **반대 방향을 보던 버그 수정**(`CFrame.new(위치)`가 회전을 초기화). 리스폰·라운드 시작 두 곳 모두 적용 — [BUG-0009](./bugs/BUG-0009-spawn-orientation-reset.md)
- **2026-07-19** — 무기 발사 **서버 입력값 검증 구멍 3건 발견**(`origin` 미검증 / `direction` 각도 미검증 / 토스터 펠릿 개수 무제한). **미수정, 우선순위 협의 대기** — [BUG-0010](./bugs/BUG-0010-weapon-server-validation-gaps.md)
- **2026-07-19** — 타격음 `shield_hit`/`hp_hit`이 로블록스 **에셋 보관 처리로 재생 실패**. 코드 정상, 에셋 교체 필요 — [BUG-0011](./bugs/BUG-0011-archived-hit-sound-assets.md)
- **2026-07-19** — 무료 모델에 섞여 있던 **백도어 14개 제거**(가짜 Error 501 로더 + 위장 PackageLink), 상시 점검용 `SecurityScan` 도입 — 보안 · [BUG-0008](./bugs/BUG-0008-toolbox-backdoor.md), [LESSON-0004](./lessons/LESSON-0004-toolbox-asset-safety.md)

- **2026-07-19** — 랭킹 HUD(상위 4명·프로필·등수 색) 구현, HUD 해상도 대응(모바일), 거점 점수 1초 +5 틱·표시 동기화, 신규 HUD가 안 뜨던 문제 해결 — 순위/획득 사유 가시화 · [AI 로그](./ai-log/2026-07-19.md), [BUG-0007](./bugs/BUG-0007-hud-screengui-whitelist.md), [FEAT-0011](./features/FEAT-0011-score-hud-kill-feedback.md)
- **2026-07-19** — 이동 V1.0.1(속도 재정의·가속 2초·관성/방향전환/공중제어·리프트 패널티), Monster Energy 필드 아이템(+10/5초 → −3/2초, 슬라이딩 +20)과 속도감 연출(글로우·FOV), 피격 빨간 글로우, 리스폰 분산 — 이동 체감 정립 및 아이템 도입 · [AI 로그](./ai-log/2026-07-19.md), [LESSON-0003](./lessons/LESSON-0003-buff-value-single-source.md)

### 2026-07-12 — 소화기 연막 · 수직 반동 · 점수 UI · 사운드 대량 추가 · 다수 버그 수정

** 소화기 연막 시스템 (신규)** — → [FEAT-0009](./features/FEAT-0009-fire-extinguisher-smoke.md)

- **소화기(Fire Extinguisher)**: HP 10 부여 → 파괴 시 **캔처럼 기울여 회전 후 소멸**, 짝지어진 연막이 **20초 발동**(3초에 걸쳐 서서히 나타났다 사라짐), **30초 후 원위치 리스폰**. 기존 연막은 평소 **투명(숨김)**, 발동 시에만 등장. 연한 **노란 윤곽** + 파괴 순간부터 분사 사운드(`Smoke Grenade`, 0.5). (`ServerScriptService.FireExtinguisherSystem`)
- **연막 가림 판정**: `SmokeActive` 속성으로 활성 연막만 판정. **적이 연막 안이면 윤곽 숨김**(내가 같은 연막 안이면 보임), 이름표·체력·실드바도 함께 숨김.
  - ~~시선 선분이 연막을 통과하면 숨김(둘 다 밖이어도 가림)~~ → **2026-07-19 철회**, 원래 판정으로 환원.

** 전투/무기**

- **수직 반동 도입** ([FEAT-0010](./features/FEAT-0010-weapon-recoil.md)): 발사마다 조준이 위로 누적(연사 시 progressive 증가), **카메라 흔들림 없이 실제 조준 pitch에 누적**(마우스가 계속 올라가는 방식, 회복 없음). **조준(ADS) 시 감소**. 전체 세기는 GunConfig 무기별 값의 **30%**로 조정. (`ReplicatedStorage.GunSystem.Recoil`, `CustomFPCamera`)
- **데미지 표기 개편** ([BUG-0006](./bugs/BUG-0006-damage-number-duplicate.md)): 단일 데미지는 **부위별 색**(머리 노랑/몸통 흰색/팔다리 회색)으로 **좌측**, **합산은 우측**에 누적 표시. 백팩 무기별 중복으로 **한 발에 여러 개 뜨던 문제 해결**(공유 `DamageNumbers` 하나로 통합 + 히트마커). 투사체(**캔 폭발·컵 파편**) 데미지도 숫자 표시 + 벽 투시.
- **헤드샷 배율 1.5 통일**(헤드 판정 없는 무기 제외).
- **컴퍼스 들기 모션 1.5배속**(장착 잠금 시간도 길이÷1.5로 정합).
- **유리컵 조정**: 범위 반지름 **3.5**, 파편 수 **50**(절반), 파편 외곽선 **0.002**로 매우 얇게. 기존 폭발음 제거 → `Glass Bottle Break`로 교체.

** 리스폰 개편** — → [BUG-0005](./bugs/BUG-0005-respawn-forcefield-sparkle.md)

- **스폰 반짝이(ForceField) 제거**: SpawnLocation `Duration` 전부 0 + 스폰 즉시 ForceField 파괴(3개가 Duration=10이라 계속 생기던 것이 원인).
- **5초 무적을 스폰 순간 즉시 적용**(리스폰 실드 피해 버그 방지), 엔진 무적이 덮던 것 제거.
- **회복 아이템(책) 리스폰 시 재충전**. 쉴드 최대 **100**, 책 최대 소지 **5**.

** 점수/UI** — → [FEAT-0011](./features/FEAT-0011-score-hud-kill-feedback.md)

- **점수판(우상단)**: **등수**(1~3위 금·은·동)·**프로필 얼굴**·점수 표시, 본인 강조. **킬 획득 사유**(처치 / 거점 처치 / N연속 처치)를 **흰 글씨**로 팝업.
  - → **2026-07-19 개편**: 위치 **상단 중앙**(최대 4명), 갱신 **이벤트 기반**, 사유 **영어 표기**, 본인 표시 **흰 테두리**. [FEAT-0011](./features/FEAT-0011-score-hud-kill-feedback.md)
- **크로스헤어 점(dot)만** — 십자선 제거.

** 사운드**

- **킬 사운드(Apex)** — 킬한 **본인만** 2D로 청취. → **2026-07-19 교체**: `kill`(내 몸) + `kill_crowd_1`/`_2`(관중석). [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **관중 환호** — 킬 시 **관중석 8방향**에서 울림(맵 바깥 스탠드 좌석 기준 배치).
- **캔**: 폭발 시 `water splash`(0.8), 첫 바운스 시 `Drop soda can`(1회, 끝까지 재생).
- 이동/피격/리스폰 사운드 정비(기존).

** 이동**

- **달리기 자동 재개**: 좌우 스트레이프/후진 후 다시 전진하면 **자동으로 달리기 복귀**(달리기 의도 유지, Shift 재입력 불필요). 지면에서 완전히 멈추면 해제.

** 버그 수정**

- **실리콘건·토스터 든 채 슬라이딩 시 하늘로 날아가는 버그** ([BUG-0004](./bugs/BUG-0004-slide-launch-viewmodel-raycast.md)): 슬라이드 지면 스냅 레이캐스트가 **카메라 밑 뷰모델 파트를 바닥으로 오인**해 매 프레임 끌어올리던 것 → 레이캐스트에서 **카메라(뷰모델) 제외 + 실제 충돌 바닥(CanCollide)만 인정**. (목발 3인칭 리깅 작업 중 유입된 이슈)
- 데미지 숫자 중복 표시, 투사체·컵 파편 데미지 미표시 수정.

>  알려진 이슈: 랭킹 점수판 UI 표시 재확인 필요(런타임 검증 예정).

### 2026-07-08 — 쉴드 책 리스폰·탈취 · 슬라이드/3인칭 애니 정리 · 컴퍼스 재장전

- **쉴드템(책) 리스폰·탈취**: 리스폰 시 책 **3개로 고정**. **사망 시 남은 책이 소닉 링처럼 튀어나와**(파란 네온 구슬) 아무나 밟으면 +1(최대 99), 20초 후 소멸 → 킬 시 상대 쉴드 책 탈취. (`ServerScriptService.HealHandler`)
- **컴퍼스 재장전 총 움직임 수정**: Tilt(Action2, 스웨이)가 총 본체(Main)를 붙잡아 재장전 시 **팔만 움직이고 총이 정지**하던 문제 → **Reload 우선순위 Action3**로 올려 정상화(1인칭 뷰모델). Fire의 스웨이 우선 설계는 유지.
- **컴퍼스 단발 사격음 → `shot_1`**: 본인 2D(`GunSystem.Sounds.Compass.Fire`)·상대 3D(`Handle.FireSound3D`) 모두 `compass_sound.shot_1`(id `95763476304057`)로 통일.
- **3인칭 애니 우선순위 레이어링**: 상체 홀드·조준=Action2, 사격·재장전·들기=Action3, 슬라이드=Action. **팔·상체는 무기 애니, 다리는 슬라이드**가 담당 → 슬라이드 중에도 사격 동시 적용, 사격이 홀드 위로 깔끔히 표시. ([애니메이션](./architecture/systems/presentation/animation-system.md))
  - 애니 우선순위는 **업로드 시 구워진(baked) 값**이 상대 화면에 쓰임 — 런타임 `track.Priority`는 본인 화면만 적용될 수 있음. 상대에게도 정확히 보이려면 애니 편집기에서 Priority 지정 후 업로드 필요.
- **슬라이드 포즈 유지**: 1프레임 슬라이드 애니를 재생 후 `AdjustSpeed(0)`으로 **포즈 고정**(루프 아님), 종료 시 기본 동작 복귀.
- **슬라이드 "떠 보임" 수정**: R6라 슬라이드 중에도 서있는 높이여서 서서 미끄러지듯 보이던 것 → 슬라이드 동안 **HipHeight −1.5로 낮춤**, 종료 시 복귀(값 조절 가능).

### 2026-07-03 — 이동/전투 밸런스 · 시선-몸통 고정 · AI 봇 · 컴퍼스 사운드

- **AI bot mode**: Tab 메뉴 버튼으로 봇 2기 소환(플레이어 동일 체력·쉴드, 플레이어 리그). 거점 이동/시야 교전/피격 주목/자동 리스폰. → [FEAT-0007](./features/FEAT-0007-ai-bot-mode.md)
- **컴퍼스 애니 사운드 이벤트**: 애니 마커→`compass_sound` 재생(본인 2D + 상대 3D), `end` 마커로 소리 종료. Compass Reload 애니 등록. → [FEAT-0008](./features/FEAT-0008-compass-anim-sound-events.md)
- **시선-몸통 고정**: 캐릭터 정면을 항상 카메라(내 시선)에 고정(`FaceCameraLock`). AutoRotate 무력화 → 카메라 기준 스트레이프. 1인칭 시선 = 3인칭 몸통 정합.
- **이동/전투 밸런스**:
  - 점프력 절반(JumpHeight 7.2→3.6), 이동속도 25, 슬라이드 65(SlideMinSpeed 18), **슬라이드 벽 막힘 스턴 제거**.
  - **벽타기 삭제**(사다리만) — 커스텀 벽 붙기 비활성.
  - **탄속↑**(트레이서 2700→5000), 탄 크기 0.6, **공격범위 확대**(서버 히트 Raycast → Spherecast 반경 0.7).
  - 실리콘건 사거리 500.
  - 책 힐 중 **쉬프트/컨트롤(달리기·슬라이드) 입력 시 힐 취소**.

## 2026-06

### 2026-06-30 — 거점 점령전 구현 + 힙파이어/크로스헤어 + 위키 보강

- **거점 점령전 1·2단계 구현**: 거점 점수(혼자=↑/둘 다=정지) + 1000점·5분 승리·라운드. 점수 속도 4/s, 거점 감지 영역 확대. → [FEAT-0005](./features/FEAT-0005-capture-point.md)
  - `거점 파트` 오브젝트는 추후 변경될 수 있음(시스템은 CFrame·Size를 그대로 사용).
- **스카우터 제거**: ADS 스코프 오버레이 삭제, **화면 중앙 크로스헤어(힙파이어 에임) 상시 표시**. → [FEAT-0006](./features/FEAT-0006-hipfire-accuracy.md)
- **힙파이어 정확도**: `SpreadState` 공유 모듈로 이동/공중 상태별 탄퍼짐 + **다이내믹 크로스헤어**(무기 base Spread 연동). 레이저=고정, 샷건=넓게.
- **위키 보강(26.06.21 기획 반영)**: [게임 모드(거점 점령전)](./overview/game-mode.md) 신규 문서, 파밍 시스템·실리콘 슬로우(미구현)·크로스헤어 장탄 UI 기획을 백로그/HUD 문서에 반영.

### 2026-06-28 — SiliconGun 사격 포즈 + 위키 재구성

- **실리콘건 사격 포즈**: Fire 애니(`138179196835705`) 등록, 탄약비례 포즈 스크럽 + **연속사격 부들거림**(0→50발 램프, 손 떼면 리셋). → [FEAT-0004](./features/FEAT-0004-silicongun-fire-pose.md)
- **위키 재구성**: 사이드바 자동 접기(현재 섹션만 펼침), 게임 시스템 10개 → 4그룹(전투 / 표현 / 게임루프 / 기반), 홈을 "지금 뭐 하려고 왔나요?" 행동형 허브로 — 가독성·집중도 개선.

### 2026-06-26 — 무기·힐 시스템 수정 (스쿨 킹 공동 작업실)

- **토스터**: 탄착군 9펠릿(중앙1+팔각형8), 펠릿당 데미지 8(전탄 72). ([무기](./architecture/systems/combat/weapon-system.md))
- **컴퍼스**: 3점사 고정(전환 불가), 탄창 21→15. **목발(LegCrutch)**은 burst→auto 복구.
- **토스터 재장전**: 재장전 시작 시 빵 복원, HandleUp 삭제, 2발째 우선순위↑, ReloadDedicated 애니 교체(108963317284184), 자동재장전. ([애니메이션](./architecture/systems/presentation/animation-system.md))
- **힐**: 사망과 동시에 힐 입력 차단(startHeal 사망 가드). → [BUG-0003](./bugs/BUG-0003-heal-after-death.md)
- **실리콘건**: 신규 리깅 뷰모델 교체 + 전용 애니 폴더 등록. ([FEAT-0003](./features/FEAT-0003-silicongun-rework.md))
- **실리콘건 레이저**: 발당 반동·소리·네온볼 제거, 좌클릭 1회 소리, 빔 barrel 앞면 끝 출발.
- **실리콘건 재장전**: 겹친 튜브(foam/foam 2) 잔상 제거(변위 추적 후 eject 튜브 숨김).
- **CAN**: 임시 뷰모델 CANVM 적용 + **쉴드 우선 데미지로 수정**. → [BUG-0002](./bugs/BUG-0002-can-shield-bypass.md), [LESSON-0002](./lessons/LESSON-0002-damage-via-shieldsystem.md)

- **2026-06-24** — SiliconGun 애니메이션은 미구현 상태로 명시(추후 적용 예정), TODO 등록.
- **2026-06-24** —  **전체 베이스라인 확립**: 총기 시스템·리깅·머즐·애니메이션 세트·구현 방식을 오늘 코드 기준으로 전부 문서화. 신규 [애니메이션 세트](./architecture/systems/presentation/animation-system.md), [구현 방식](./architecture/systems/foundation/implementation-conventions.md), [리깅·머즐](./architecture/systems/presentation/viewmodel-rigging.md)(근접·수류탄 포함). 이후 모든 변경은 이 기준점과 비교.
- **2026-06-24** — 전 총기(Compass·LegCrutch·Toaster·SiliconGun) 뷰모델 리깅·머즐 기준점 기록 — 머즐 파트·MeshId·Weld/Motor6D 허브 구조 표로 정리 → [리깅·머즐 문서](./architecture/systems/presentation/viewmodel-rigging.md)
- **2026-06-05** — 위키에 흑백 테마 적용, 카테고리 페이지에 하위문서 카드 추가 — 가독성·탐색성 개선
- **2026-06-05** — Roblox 코드 분석 문서화: [코드 구조](./architecture/code-structure.md), [무기 시스템](./architecture/systems/combat/weapon-system.md) 실수치 반영 — 구현과 문서 동기화
- **2026-06-05** — 게임 시스템 위키로 전면 개편(6대 카테고리 + 키워드 허브) — 코드 위 구조 레이어 확보
- **2026-06-04** — Docusaurus + GitHub Pages 위키 최초 구축, 노션 콘텐츠 이전 — 노션 무료플랜 한계 탈피

<!-- 새 항목은 이 위에 추가 (최신이 맨 위) -->
