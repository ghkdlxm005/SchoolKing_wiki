---
title: 버그 이력 (Bug History)
sidebar_position: 1
tags: [bug]
---

import DocCardList from '@theme/DocCardList';

# 버그 이력 (Bug History)

새 버그는 `docs/_templates/bug.md`를 복사해 `BUG-####-제목.md`로 만든다.

| ID | 제목 | 심각도 | 상태 | 시스템 |
| --- | --- | --- | --- | --- |
| [BUG-0001](./BUG-0001-spawn-invincibility-timing.md) | 스폰 무적 타이밍 예시 | medium | 예시 | spawn |
| [BUG-0002](./BUG-0002-can-shield-bypass.md) | CAN 데미지가 쉴드 무시 | high | fixed | weapon/combat |
| [BUG-0003](./BUG-0003-heal-after-death.md) | 사망 후 힐 실행 | medium | fixed | heal |
| [BUG-0004](./BUG-0004-slide-launch-viewmodel-raycast.md) | 무기 든 채 슬라이딩 시 하늘로 날아감 | high | fixed | movement |
| [BUG-0005](./BUG-0005-respawn-forcefield-sparkle.md) | 리스폰 반짝이·무적·실드 피해 오작동 | medium | fixed | spawn |
| [BUG-0006](./BUG-0006-damage-number-duplicate.md) | 한 발에 데미지 숫자 여러 개 | medium | fixed | ui/weapon |
| [BUG-0007](./BUG-0007-hud-screengui-whitelist.md) | 새로 만든 HUD가 화면에 안 나옴 | high | fixed | ui |
| [BUG-0008](./BUG-0008-toolbox-backdoor.md) | 무료 모델 백도어 (가짜 Error 501) | **critical** | fixed | security |
| [BUG-0009](./BUG-0009-spawn-orientation-reset.md) | 스폰 시 캐릭터가 반대 방향을 봄 | medium | fixed | spawn |
| [BUG-0010](./BUG-0010-weapon-server-validation-gaps.md) | 무기 발사 서버 검증 구멍 3건 | high | **open** | weapon/security |
| [BUG-0011](./BUG-0011-archived-hit-sound-assets.md) | 타격음 2종 재생 실패 (에셋 아카이브) | medium | fixed | sound |
| [BUG-0012](./BUG-0012-viewmodel-left-behind.md) | 라운드 리셋 후 뷰모델이 제자리에 남음 | high | fixed | weapon/ui |
| [BUG-0013](./BUG-0013-compass-marker-sound-path.md) | 컴퍼스 애니 마커 사운드 전부 미재생 | high | fixed | sound/weapon |
| [BUG-0014](./BUG-0014-audience-outline-and-ambience.md) | 관중 일부에만 윤곽선·함성 적용 | medium | fixed | ui/sound/map |
| [BUG-0015](./BUG-0015-r15-slide-wall-clip.md) | R15 전환 후 슬라이딩 벽 통과 | high | fixed | movement/rig |
| [BUG-0016](./BUG-0016-crouch-forward-studio-ctrlw.md) | 앉은 채 W가 Studio에서만 안 먹힘 | low | 환경 원인 | movement/input |
| [BUG-0017](./BUG-0017-rig-limbs-welded.md) | 3인칭 리그 팔다리가 캐릭터에 웰드(파란 몸) | mid | 리그 판별 누락 | rig |
| [BUG-0018](./BUG-0018-heal-busy-stuck.md) | 힐 도중 사망 시 healBusy 박제 → 책 안 먹힘 | mid | 상태 미해제 | heal |
| [BUG-0019](./BUG-0019-teamtest-menu-bypass.md) | 팀 테스트 · 후속 접속자 메뉴 우회 | high | fixed | system/ui |
| [BUG-0020](./BUG-0020-matchmaking-fragmentation.md) | 매칭 파편화 (각자 다른 방 배정) | high | fixed | system |
| [BUG-0021](./BUG-0021-spawn-equip-viewmodel-missing.md) | 스폰 직후 장착 시 1인칭 뷰모델 미생성 | high | fixed | weapon/ui |
| [BUG-0022](./BUG-0022-can-explosion-wall-penetration.md) | 캔 폭발이 벽을 통과해 데미지 | medium | fixed | weapon |
| [BUG-0023](./BUG-0023-silicon-laser-afterimage.md) | 실리콘건 레이저 잔상 잔존 | high | fixed | weapon |
| [BUG-0024](./BUG-0024-customize-loadout-prespawn.md) | 메인화면 Customize 무기 선택창 안 뜸 | medium | fixed | ui |
| [BUG-0025](./BUG-0025-staggered-play-spawn.md) | 시차 PLAY 참가자 스폰 누락 | high | fixed | system |
| [BUG-0026](./BUG-0026-you-died-stuck-on-play.md) | PLAY 시 YOU DIED 화면 박제 | high | fixed | ui/respawn |
| [BUG-0027](./BUG-0027-legcrutch-tracer-lingering.md) | 목발 총알 궤적(트레이서) 잔존 | medium | fixed | weapon/render |
| [BUG-0028](./BUG-0028-meleehitevent-missing.md) | MeleeHitEvent 미존재로 근접 넉백 무효 | high | fixed | weapon/combat |
| [BUG-0029](./BUG-0029-slidescript-forward-decl-nil.md) | SlideScript cleanupAll targetSpeedFor nil | medium | fixed | movement |

> 상태: `열림(open)` → `수정 중` → `해결(fixed)` → `재발 감시`
> 심각도: `critical` / `high` / `medium` / `low`

## 하위 문서

<DocCardList />
