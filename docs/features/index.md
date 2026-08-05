---
title: 기능 이력 (Feature History)
sidebar_position: 1
tags: [feature]
---

import DocCardList from '@theme/DocCardList';

# 기능 이력 (Feature History)

새 기능은 `docs/_templates/feature.md`를 복사해 `FEAT-####-제목.md`로 만든다.

| ID | 기능 | 상태 | 시스템 | 날짜 |
| --- | --- | --- | --- | --- |
| [FEAT-0001](./FEAT-0001-grenade-fragmentation.md) | 세열 수류탄 | 구현 중 | weapon | 2026-02 |
| [FEAT-0002](./FEAT-0002-mug-puddle-grenade.md) | 머그컵 장판 수류탄 | 기획 | weapon | 2026-02 |
| [FEAT-0003](./FEAT-0003-silicongun-rework.md) | SiliconGun 뷰모델·레이저·재장전 개편 | 구현 | weapon | 2026-06 |
| [FEAT-0004](./FEAT-0004-silicongun-fire-pose.md) | SiliconGun 사격 포즈·연속사격 부들거림 | 완료 | weapon | 2026-06 |
| [FEAT-0005](./FEAT-0005-capture-point.md) | 거점 점령전 시스템 (점수·승리) | 구현 1·2단계 | system | 2026-06 |
| [FEAT-0006](./FEAT-0006-hipfire-accuracy.md) | 힙파이어 정확도·다이내믹 크로스헤어·스카우터 제거 | 완료 | weapon | 2026-06 |
| [FEAT-0007](./FEAT-0007-ai-bot-mode.md) | AI bot mode (전투 봇) | 구현 · 개선 중 | system | 2026-07 |
| [FEAT-0008](./FEAT-0008-compass-anim-sound-events.md) | 컴퍼스 애니 마커 → 사운드 이벤트 | 완료 | weapon | 2026-07 |
| [FEAT-0009](./FEAT-0009-fire-extinguisher-smoke.md) | 소화기 연막 시스템 (파괴·연막·리스폰) | 완료 | map/system | 2026-07 |
| [FEAT-0010](./FEAT-0010-weapon-recoil.md) | 총기 수직 반동 (조준 누적·ADS 감소) | 완료 | weapon | 2026-07 |
| [FEAT-0011](./FEAT-0011-score-hud-kill-feedback.md) | 점수판·킬 피드백 UI (등수·얼굴·사유·사운드) | 완료 · 재검증 | ui/system | 2026-07 |
| [FEAT-0012](./FEAT-0012-sound-system.md) | 사운드 개편 (킬·사망·승리·관중 앰비언스) | 완료 · 밸런스 검토 | sound/system | 2026-07 |
| [FEAT-0013](./FEAT-0013-r6-to-r15-migration.md) | R6 → R15 전환 | 스크립트 완료 · 애니 재작업 대기 | rig/character | 2026-07 |
| [FEAT-0014](./FEAT-0014-viewmodel-wall-clip.md) | 1인칭 뷰모델 벽 관통 방지(retract) | 완료 | viewmodel/render | 2026-07 |
| [FEAT-0015](./FEAT-0015-looting-rework.md) | 루팅 개편(책 드롭·근접 흡수) | 완료 | heal/loot | 2026-08 |
| [FEAT-0016](./FEAT-0016-deathcam-respawn.md) | 데스캠·리스폰 시스템 | 완료 | respawn/ui | 2026-08 |
| [FEAT-0017](./FEAT-0017-glass-wall.md) | 파괴 가능한 유리벽 | 완료 | map | 2026-08 |
| [FEAT-0018](./FEAT-0018-item-random-ability.md) | 아이템 랜덤 능력(무한탄창·무한수류탄·은신) | 완료 | system | 2026-08 |
| [FEAT-0019](./FEAT-0019-smoke-concealment.md) | 연막 은폐(시선 차단) | 완료 | map/ui | 2026-08 |
| [FEAT-0020](./FEAT-0020-grenade-accuracy-glass.md) | 수류탄 착탄 정확도 + 유리벽 관통 | 구현·재검증 | weapon | 2026-08 |
| [FEAT-0021](./FEAT-0021-parkour-glass-break.md) | 파쿠르 — 유리벽 SPACE 파괴 | 기능 구현 | movement | 2026-08 |
| [FEAT-0022](./FEAT-0022-main-menu-lobby.md) | 메인 메뉴 / 로비 | 구현 | ui/system | 2026-08 |
| [FEAT-0023](./FEAT-0023-matchmaking.md) | 크로스 서버 매칭 시스템 | 구현 · 재검증 | system | 2026-08 |
| [FEAT-0024](./FEAT-0024-melee-lunge.md) | 근접공격 돌진(에이펙스식 lunge) | 구현(모션 추후) | weapon/movement | 2026-08 |
| [FEAT-0025](./FEAT-0025-grapple-zipline.md) | 그래플 집라인 (Rope_act) | 구현 · 재검증 | movement | 2026-08 |
| [FEAT-0026](./FEAT-0026-loadout-select-gate.md) | 라운드 시작 로드아웃 선택 게이트 | 구현 · 재검증 | system/ui | 2026-08 |

> 상태: `기획` → `구현 중` → `완료` → `보류`

## 하위 문서

<DocCardList />
