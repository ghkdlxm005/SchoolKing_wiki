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

## 2026-08

### 2026-08-04

- **그래플 집라인 (Rope_act)** — 기울어진 트러스 빔 `Rope_act`를 끝에서 끝으로 타는 이동기. 빔 전체에 `[E]` 프롬프트, 텔레포트 없이 `LinearVelocity`로 부드럽게 탑승, 스페이스로 하차, 타는 중 총·수류탄 사용 가능(힐 불가). 임의 Y/천장 배제하고 Rope_act 기울기 동선만 추종. 로프 비주얼 제거·프롬프트 범위 축소·무한수류탄 중 탑승 허용 — [FEAT-0025](./features/FEAT-0025-grapple-zipline.md)
- **슬라이드 사운드 서버 재생** — `Sliding.mp3`(id 81830900004468)가 **슬라이드 시작 순간**(SlideScript 상태 진입)에 서버를 통해 캐릭터에서 3D로 재생 → **본인·상대 모두** 들림. 타이밍 어긋남/중복 재생하던 클라 2D·MovementSounds 경로 제거(`SlideSoundEvent`·`SlideSoundServer` 신설).
- **유리벽·문 파트 전체 상호작용** — 정중앙만 잡히던 프롬프트를, 카메라 시선 레이가 파트에 닿고 **근접(12 stud 이내)** 하면 해당 오브젝트 프롬프트가 켜지도록 변경(무한 사거리 아님). 파트 아무 데나 봐도 [Space]/[E] 동작 — `GazeInteract`(신설).
- **BUG-0026 PLAY 시 YOU DIED 박제** — 로비 HUD 처리(`setHudHidden`)가 DeathScreen을 강제로 켜, 사망이 아닌데도 사망 화면이 남던 문제 → 강제표시 제거(표시 권한은 데스캠 시스템만) — [BUG-0026](./bugs/BUG-0026-you-died-stuck-on-play.md)
- **BUG-0027 목발 트레이서 잔존** — 트레이서 이동이 느리고 비행시간 상한이 커서 궤적이 잔상처럼 남던 문제 → TRACER_SPEED 300→3500, travelTime clamp 1.5→0.2 — [BUG-0027](./bugs/BUG-0027-legcrutch-tracer-lingering.md)
- **연막 기본 투명 + 피격 시에만 노출** — 소화기 연기 파트를 평소 완전 투명(Transparency 1)으로 두고, 소화기 분사로 맞았을 때만 노출(활성 투명도 0.9, 기존 authored 값 유지). — [FEAT-0009](./features/FEAT-0009-fire-extinguisher-smoke.md)
- **은신 데미지 버프 삭제** — 은신(Stealth) 중 데미지 2배(`StealthDmgBuff`) 제거. 은신은 은닉 기능만(공격 시 은신 해제는 유지) — `ShieldSystem`.
- **BUG-0021 스폰 직후 장착 시 1인칭 뷰모델 미생성** — 태어나자마자 1번키로 무기를 꺼내면 총알은 나가는데 손에 무기가 안 보이던 문제. ClientHandler 초기화가 끝나기 전 장착이 일어나 `tool.Equipped`가 유실되던 레이스 → 전 무기 ClientHandler에 "초기화 후 뷰모델 부재 시 재장착" 안전장치 추가 — [BUG-0021](./bugs/BUG-0021-spawn-equip-viewmodel-missing.md)
- **실리콘건 개선** — 무한탄창 시 램프 무시하고 즉시 최대 데미지, 피격 시 슬로우 5(0.6초) 적용, 상대 시점에서도 보이는 서버 레이저 빔 추가, 최소/최대 데미지 6/12. 재장전음은 3인칭 애니 마커(`93584166771428`)의 `silicon_ready/reload_1/reload_2` 기반으로 재생.
- **무기 밸런스 조정** — 목발 탄창 30→27, 목발 사운드 전체 음량 -30%. 컴퍼스 버스트 후 재발사 간격 -50%(`BurstCooldownMultiplier` 2→1).
- **관중 사운드 조정** — audience Back 음량 +20%, 번갈아 나오는 함성 교차 지점 50%→80%.
- **무기 밸런스 2차 (전 무기 튜닝)** — 실리콘건: 창문(유리벽) 타격 데미지 2배. 목발: 재장전 2.2→1.2초. 컴퍼스: 자동사격 전환(꾹 누르면 연사) + 발사 간격 50% 단축(0.09→0.045) + 탄퍼짐 1.5배(0.006→0.009). 토스터: 차지 전구간 발사속도 제한 삭제(ChargedFireRate 1.0→0.1) + 발사 간격 감소(0.15→0.1) + 차지시간 1.05→0.6 + 거리감쇠 삭제(FalloffMin 1.0). 쓰레받이: 데미지 18→50 + 범위 내 자동 타겟팅(각도 무관) + 피격 넉백 + 피격자 화면 흔들림. 컵: 틱당 데미지 5→10 + 장판 슬로우 10→15 + 파편 +20%(50→60). 캔: 음량 +30%, 빨강 외곽선(연막·벽 투과 표시). 소화기: 분사 사운드 복구(경로 `SFX.object.Smoke Grenade`) + 연막 유지 20→25초 + 리스폰 30→55초.
- **근접 넉백 실동작(근접 전용) + 본인 발소리 통일** — (1) 근접공격 넉백이 안 밀리던 문제: 플레이어는 클라가 물리 권한이라 서버 속도가 무시됨 → 근접 전용 이벤트로 피격자 클라가 직접 밀도록 수정(봇은 서버). 근접 맞았을 때만 밀림(검증: 10.9 stud). (2) 본인/상대 발소리를 완전히 같은 리그·소리·템포로 통일(내가 듣는 소리 = 상대가 듣는 소리). Dustpan 우클릭 쉴드 삭제.
- **근접공격 돌진(에이펙스식 lunge)** — 정면 사거리(11) 내 적에게 근접공격 시 그쪽으로 살짝 돌진(붙음)하며 데미지+넉백 동시 적용. Dustpan 휘두르기 + 전 무기 V키 공통. 사거리 5→11 확장. 때리는 모션은 추후 — [FEAT-0024](./features/FEAT-0024-melee-lunge.md)
- **Dustpan 쉴드 기능 삭제** — 의미 없던 우클릭 방어(쉴드) 제거. 우클릭 무동작.
- **근접공격 데미지 숫자 표시** — Dustpan 휘두르기 + 전 무기 V키 근접이 데미지를 줘도 숫자가 안 뜨던 문제(HitFeedbackEvent 미발사). 명중 시 공격자에게 HitFeedbackEvent 발사 → DamageNumbers가 숫자/히트마커 렌더.
- **Dustpan 1인칭 손 개선** — 뻣뻣하게 고정돼 보이던 손에 정지=호흡, 이동=걷기 흔들림 스웨이 추가. 슬라이딩 시 손이 오른쪽 위로 올라가던 procedural slide tilt 제거(총들과 동일).
- **실리콘건 레이저 이중/지연 제거** — 쏘는 본인에게는 남들용 서버 빔(10Hz, 네트워크 지연)을 숨기고(소유자 태그 + LocalTransparencyModifier) 실시간 클라이언트 빔만 보이게. 본인 시점에서 지연된 중복 레이저가 사라져 발사와 완전히 동기화. 남들은 서버 빔을 그대로 봄.
- **BUG-0024 메인화면 Customize 무기창 안 뜸** — GameHUD는 StarterGui 소속이라 첫 캐릭터 스폰 전엔 PlayerGui로 복사되지 않아 HUDController(로드아웃 창·Customize 리스너)가 미실행 → 접속 시 GameHUD를 미리 복제(HUDEarlyLoad), 스폰 복사본은 HUDController가 중복 폐기, 로비 중 HUD 프레임 숨김 + 로드아웃은 메뉴 위로(DisplayOrder) — [BUG-0024](./bugs/BUG-0024-customize-loadout-prespawn.md)
- **BUG-0025 시차 PLAY 참가자 스폰 누락** — 팀 테스트 2인이 시차를 두고 PLAY 시, 뒤늦게 참가한 쪽이 라운드 시작 스폰(scatter)에 안 잡혀 엉뚱한 곳/미스폰 → 진행 중 참가자를 아레나 스폰 지점에 보장 배치(미스폰 대상만, 사망 리스폰은 기존 시스템 유지) — [BUG-0025](./bugs/BUG-0025-staggered-play-spawn.md)
- **라운드 리셋 시 봇 점수·맵 초기화** — 새 라운드 시작 시 봇 Score를 0으로, 남은 레이저/투사체/장판 파트 정리. 초기 Phase를 `lobby`로 바꿔 첫 라운드 전 오작동 방지.
- **토스터 무한탄창 연사** — 무한탄창(InfiniteAmmo) 활성 시 좌클릭을 꾹 누르면 반자동 대신 연사 유지(마우스·모바일 모두). 서버는 이미 무한탄창 시 탄약 미차감이라 지속 발사 허용.
- **토스터 펠릿 3×3 정사각형** — 기존 "중앙 1 + 팔각형 8"(원형 9발) 산포를 3×3 격자(9발)로 변경. 발 수 동일이라 서버 판정은 그대로.
- **BUG-0023 실리콘건 레이저 잔상 잔존** — 상대 시점용 서버 빔이 매 틱 새 파트를 생성(참조를 tool에서 찾는데 실제론 workspace에 둠)해 안 지워지고 쌓임 → 빔을 state에 저장해 하나만 재사용, 발사 정지 0.15초 후 숨김·장착 해제 시 제거 — [BUG-0023](./bugs/BUG-0023-silicon-laser-afterimage.md)
- **BUG-0022 캔 폭발이 벽을 통과해 데미지** — 폭발이 반경만 검사해 벽 뒤 대상까지 피해 → 폭발점→대상 시야(LOS) 레이캐스트로 솔리드 벽 차폐 시 데미지 차단(유리벽은 관통 허용) — [BUG-0022](./bugs/BUG-0022-can-explosion-wall-penetration.md)

### 2026-08-03

- **메인 메뉴 / 로비 폴리싱** — 왕관 윤곽선 제거 + 캐릭터 머리 추적 + 회전 30% 감속, 로고 확대·우상단, PLAY 버튼 하강 + 로고풍(Bangers) 폰트, 좌상단 ESC 라벨 제거. "다리 파랑"은 실제 아바타(기본 청바지 + LeftLegColor)로 확인 — 버그 아님 — [FEAT-0022](./features/FEAT-0022-main-menu-lobby.md)
- **크로스 서버 매칭 시스템** — PLAY → MemoryStore 큐 → 단일 리더가 예약 서버 생성 → 함께 배정 → TeleportToPrivateServer. 예약 서버는 거점 시스템이 스폰+카운트다운 단일 담당, 종료 시 로비 복귀. Studio는 단일 서버 로컬 폴백. 게시본에서만 실동작 — [FEAT-0023](./features/FEAT-0023-matchmaking.md)
- **BUG-0019 팀 테스트 · 후속 접속자 메뉴 우회** — 예약 서버 오판(Studio) · 스캐터 레이스 · 자동 스폰 · 클라 이벤트 유실 4겹 원인 대응. `InLobby==false`만 스폰, 참가자 있을 때만 라운드 시작, 클라는 어트리뷰트 기반 + 재확인 — [BUG-0019](./bugs/BUG-0019-teamtest-menu-bypass.md)
- **BUG-0020 매칭 파편화** — 서버별 매치메이커 → 단일 리더 선출 + pending 누적 풀로 교체(동시 대기자를 같은 방으로) — [BUG-0020](./bugs/BUG-0020-matchmaking-fragmentation.md)
- **LESSON-0010** — 늦은 접속자 상태는 일회성 이벤트 말고 어트리뷰트 + 재확인으로 — [LESSON-0010](./lessons/LESSON-0010-late-join-state.md)

### 2026-08-02

- **수류탄 착탄 정확도 + 유리벽 관통** — Cup을 결정론적 궤적으로 바꿔 조준 프리뷰(착탄 링)와 실제 폭발 지점이 1:1 일치(물리 볼의 벽 과인지 제거). Cup/CAN이 유리벽을 깨고 통과해 원래 착탄점까지 진행(Cup은 착탄 레이캐스트, CAN은 충돌 그룹+경로 레이캐스트). Cup 폭발음(`cup_explode`, DOT 경로) 배선, 컵 장판 밟으면 이속 -10 — [FEAT-0020](./features/FEAT-0020-grenade-accuracy-glass.md)
- **파쿠르 — 유리벽 SPACE 파괴** — 유리벽 근처에서 SPACE 프롬프트 → 파괴(기능만, 3인칭 연출 추후) — [FEAT-0021](./features/FEAT-0021-parkour-glass-break.md)
- **효과음 배선** — 투척류 can/cup의 hold/ready/throw/explode/sparkle, silicon_hold·dustpan_hold, 실리콘 장전 3인칭 애니(`93584166771428`) + 키프레임 마커 사운드(silicon_ready/reload_1/reload_2). 기존 임시음(water splash·Drop soda can·Glass Bottle Break) 제거 — [FEAT-0008](./features/FEAT-0008-compass-anim-sound-events.md) · [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **정리** — 유리벽 반사(Reflectance 0.7→0.5, 하늘 미러→광원 반응), 실리콘의 목발 사운드 제거, "Loaded anims"(Tilt) 디버그 print 제거, 연막 판정 디버그 오버레이 제거.
- **아이템 랜덤 능력 시스템** — Monster Energy 픽업 효과를 이속 버프에서 3종 랜덤 능력(무한탄창·무한수류탄·은신, 각 10초)으로 교체. 능력별 색 파워업 연출(중앙 배너·화면 플래시·가장자리 글로우·카운트다운), 픽업 이속 +5/슬라이딩 +10, 무한탄창 시 탄약 `∞` 표시 — [FEAT-0018](./features/FEAT-0018-item-random-ability.md)
- **연막 은폐 (시선 차단)** — 소화기 연막이 실제로 시야를 가리게. 내 시선(카메라→적)이 연막을 지나면 윤곽선·이름표·쉴드를 숨김(적이 연막 안 / 사이에 낌 / 내가 연막 안 모두 커버). 연막은 큰 구체 뭉치라 바운딩박스가 아닌 구체+선분 교차로 판정. 때리거나 맞은 상대는 2.5초간 서로 노출(`CombatRevealEvent`) — [FEAT-0019](./features/FEAT-0019-smoke-concealment.md) · [LESSON-0009](./lessons/LESSON-0009-hitbox-vs-visual.md)
- **쉴드 표시 개편** — 머리 위 쉴드바를 평소엔 숨기고 피격 직후에만 노출(원거리에선 외곽선만). `ShieldSystem`이 `ShieldHitAt` 기록 → `OverheadShield` 연동 — [FEAT-0019](./features/FEAT-0019-smoke-concealment.md)
- **UI 영어화** — 플레이어에게 보이는 문자열 전부 영어로 전환(로드아웃 카드·무기 설명, 데스캠, 능력 배너, 거점 승리/무승부, 힐 안내, StudentID 헤더). 앞으로 UI는 영어로만 — 새 `ScreenGui`는 `HUDController.KEEP_GUI`에 등록 필수 — [LESSON-0008](./lessons/LESSON-0008-ui-keepgui-whitelist.md)
- **유리컵/유리벽 외곽선 튜닝** — 유리벽 흰 윤곽선 진하기 50% 감소(Highlight는 두께 조절 불가라 불투명도로). 유리컵 빨간 SelectionBox는 원복.
- **데스캠 · 리스폰 개편** — 사망 시 Death cam 파트 고정 시점, 리스폰 최소 2초 / SPACE 조기 / 자동 10초, 죽은 동안만 TAB 로드아웃(블러 + 무기 상세 카드). 자동 로드 끄고 서버가 리스폰 관리 — [FEAT-0016](./features/FEAT-0016-deathcam-respawn.md)
- **파괴 가능한 유리벽** — `glass wall` HP50, 파편·흰 윤곽선·피격 흰색 번쩍·파괴음, 20초 후 페이드인 재생. 킬 점수 누수 방지(오프셋 방식) — [FEAT-0017](./features/FEAT-0017-glass-wall.md)
- **수류탄 개편** — 던지기 동작을 옛날 3-애니 방식으로 복구(단일 stop-마커·배속 폐기). 개수 도입(스폰 2 · 최대 4), 사망 시 드롭 + 근접 획득으로 내 개수 +1(`GrenadeDropSystem`), 쿨다운 1초, ThrowBox에 선택 투척류 모델·개수 표시, 소진 시 장착 차단 — `Cup/CAN Handler`, `HealHandler`, `HUDController`
- **컴퍼스 3인칭** — `r15 compass` 리그 + Idle/Equip/Reload/Crouch/Jump/CrouchWalk/Slide 하반신 포즈 루프. 장착 시 기본 Tool Handle 숨김(리그만 표시) — `Compass Handler`, `GunSystem.Animations.Compass.ThirdPerson`
- **캐릭터 파란색 버그 수정** — 3인칭 리그가 전신 R15라 팔다리 세그먼트(UpperArm/LowerArm/UpperLeg/LowerLeg/Foot)가 무기로 오인돼 캐릭터에 웰드되던 문제. `WeaponRig3P` 제외목록에 R15 팔다리 추가 — [BUG-0017](./bugs/BUG-0017-rig-limbs-welded.md)
- **힐 UI/버그** — 하단 HealBox에 실제 책 모델(뷰포트)+개수 표시(BookCount 연동). 책 드롭을 호버링 책 모델+파란 윤곽선으로. 힐 도중 사망 시 `healBusy`가 안 풀려 책이 안 먹히던 버그 수정(pcall + 리스폰 초기화) — [BUG-0018](./bugs/BUG-0018-heal-busy-stuck.md)
- **점프대 메커니즘** — 밟으면 즉시 발사에서, 좌·우 알람에서 `ALARM OFFICAL` 2번 울린 뒤 발사로 변경. conveyor(즉시 발사) 비활성화, `JumpPadSystem` 신규 — `JumpPadSystem`, `EnvironmentSFX`
- **실리콘건 장전 애니** 교체(`70689278167503`). **발소리** 달리기 템포 통일 후 기본으로 롤백.

### 2026-08-01

- **루팅 개편 (책 드롭·근접 흡수)** — 사망 시 보유 책 개수만큼 소닉 링처럼 드롭. 획득은 자석/킬러 우선이 아니라 몬스터 캔과 동일한 근접 방식(반경 5스터드, 살아있고 책 여유 있는 플레이어). 최대 보유 5, 0.6초 픽업 딜레이 — [FEAT-0015](./features/FEAT-0015-looting-rework.md)
- **힐 키4 단순화** — 힐 아이템이 책(쉴드) 하나로 정리돼 4번 꾹 눌러 여는 방사형 선택 휠 제거. 4번 누르면 즉시 쉴드 힐, 힐 중 4번은 취소. 휠 코드는 향후 아이템 확장 대비 주석으로 보류 — `HealController`

## 2026-07

### 2026-07-26

- **환경 사운드 추가** — 점프대(`jump_platform`)·경고등(`gym_spot`)·가속기(`booster`)·중앙 리프트(`lift`)에 터치 사운드. 신규 `EnvironmentSFX`, `conveyorScript` 보유로 자동 판별(이름 하드코딩 없음) — [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **아이템 획득 사운드** — 책·부스트 음료 획득 시 획득 위치에서 `item_pickup` — [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **관중 함성 교체** — `crowd_1/2` → `crowd_1_fix/2_fix`, 위치(audience Back)는 유지하고 랜덤 재생으로 변경 — [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **미완** — `gym_spot`(경고등) 에셋 미업로드. `SFX.object.gym_spot`에 SoundId 필요
- **앉기+W 미동작(Studio 한정)** — `Ctrl+W`를 Studio가 단축키로 가로채 W가 게임에 안 들어옴. 코드 무결, 실플레이어 정상 — [BUG-0016](./bugs/BUG-0016-crouch-forward-studio-ctrlw.md) · [LESSON-0006](./lessons/LESSON-0006-input-not-code.md)
- **1인칭 뷰모델 벽 관통 방지** — 레이캐스트 retract로 총을 카메라 쪽으로 당김. 총은 월드에 그대로라 조명·그림자·파티클 유지. ViewportFrame(조명·파티클 상실)·모델 축소(FakeCamera 충돌)는 대가 커서 폐기 — [FEAT-0014](./features/FEAT-0014-viewmodel-wall-clip.md) · [LESSON-0007](./lessons/LESSON-0007-viewmodel-wall-clip.md)
- **1인칭 본인 그림자** — 몸은 숨기되 그림자는 유지(`CastShadow` 보장, `GlobalShadows`) — [FEAT-0014](./features/FEAT-0014-viewmodel-wall-clip.md)
- **사운드 재배선** — 컴퍼스 사격음(`shot_1`) 코드 트리거 + 타인 3D 전파, 재장전 3D 시퀀스. 토스터는 목발 기본 소리(9341262362/138318339957104) 제거하고 `SFX.toaster`로 전면 교체(발사·조준·장전, 본인 2D + 타인 3D) — [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **애니 마커 사운드 확대** — 컴퍼스 장전 애니 교체(compass_sound 마커 자동 재생), 토스터 장전 애니 + `SFX.toaster` 마커 바인딩 신설 — [FEAT-0008](./features/FEAT-0008-compass-anim-sound-events.md) · [FEAT-0012](./features/FEAT-0012-sound-system.md)
- **3인칭 확장** — 목발 재장전·달리기 애니, 투척물(컵·캔) 던지기 Stop-마커 상태머신 + `r15 can` 리그 손 웰드, 책 힐 3인칭 애니 + `r15 book` 프롭 웰드(`BookHealRig`) — [FEAT-0013](./features/FEAT-0013-r6-to-r15-migration.md)

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
