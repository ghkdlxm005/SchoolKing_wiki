---
title: 개발 일지 (Dev Log)
sidebar_position: 1
tags: [ai-log]
---

import DocCardList from '@theme/DocCardList';

# 개발 일지 (Dev Log)

날짜별 개발 내역. 무엇을 왜 바꿨는지, 어느 스크립트를 건드렸는지 개발 전후로 남긴다.

새 로그는 `docs/_templates/ai-log.md`를 복사해 `YYYY-MM-DD.md`로 만든다.

| 날짜 | 개발 항목 | 관련 |
| --- | --- | --- |
| [2026-08-13](./2026-08-13.md) | AI 봇 48차(전투 중 고지 선점 — 사다리·양쪽 건물 실사용), 고지 후보 반경 82 확대 | [changelog](../changelog.md), [FEAT-0027](../features/FEAT-0027-ai-bot-system.md) |
| [2026-08-10](./2026-08-10.md) | AI 봇 전투 다중화(무기 성향 브롤러/스나이퍼/스키미셔/듀얼리스트 + mood 변주 + 스폰 무기 분산 + 위층 캠퍼 추격), 학습 데이터 탑다운 뷰어 | [changelog](../changelog.md) |
| [2026-08-08](./2026-08-08.md) | AI 봇 26~39차(수류탄 통합·멈블·능력·명중률·토스터·힐·엄폐 투척), 게임 종료 K/D/A 점수판, 거점 초당 3점·수직 확장, 연막 프레임 드랍, 텔레메트리+DataStore 학습 인프라+RouteLibrary v1, 게시본 마우스 잠김(치명) | [changelog](../changelog.md) |
| [2026-08-06](./2026-08-06.md) | 상대 달리기 소리 통일, 무기 밸런스(컴퍼스·실리콘건), Dustpan 강화, 에너지드링크 개편, 토스터(총알·빵·3인칭·차징 실제메시), 모든 총알 궤적, 로드아웃 선택 게이트, 매칭 수락 팝업, 버그 2건, AI 봇(CleanUP) 개선 10~25차 | [FEAT-0026](../features/FEAT-0026-loadout-select-gate.md), [FEAT-0023](../features/FEAT-0023-matchmaking.md), [BUG-0028](../bugs/BUG-0028-meleehitevent-missing.md), [BUG-0029](../bugs/BUG-0029-slidescript-forward-decl-nil.md) |
| [2026-07-23](./2026-07-23.md) | R15 슬라이딩 벽 통과 수정, 관중 처치/사망 사운드 A·B 재배치, 발소리 튜닝, 힐 취소 조건 축소, 콘솔 정리 | [BUG-0015](../bugs/BUG-0015-r15-slide-wall-clip.md), [FEAT-0012](../features/FEAT-0012-sound-system.md), [FEAT-0013](../features/FEAT-0013-r6-to-r15-migration.md) |
| [2026-07-19](./2026-07-19.md) | 랭킹/점수 HUD, HUD 화면 맞춤(모바일), 거점 점수 틱·동기화, UI 미표시 버그 / 이동 V1.0.1, Monster Energy 아이템, 리스폰 분산, 피격 피드백 | [BUG-0007](../bugs/BUG-0007-hud-screengui-whitelist.md), [FEAT-0011](../features/FEAT-0011-score-hud-kill-feedback.md), [LESSON-0003](../lessons/LESSON-0003-buff-value-single-source.md) |

<DocCardList />
