---
title: "📝 변경 이력 (Changelog)"
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

## 2026-06

### 2026-06-30 — 거점 점령전 구현 + 힙파이어/크로스헤어 + 위키 보강

- **거점 점령전 1·2단계 구현**: 거점 점수(혼자=↑/둘 다=정지) + 1000점·5분 승리·라운드. 점수 속도 4/s, 거점 감지 영역 확대. → [FEAT-0005](./features/FEAT-0005-capture-point.md)
  - ⚠️ `거점 파트` 오브젝트는 추후 변경될 수 있음(시스템은 CFrame·Size를 그대로 사용).
- **스카우터 제거**: ADS 스코프 오버레이 삭제, **화면 중앙 크로스헤어(힙파이어 에임) 상시 표시**. → [FEAT-0006](./features/FEAT-0006-hipfire-accuracy.md)
- **힙파이어 정확도**: `SpreadState` 공유 모듈로 이동/공중 상태별 탄퍼짐 + **다이내믹 크로스헤어**(무기 base Spread 연동). 레이저=고정, 샷건=넓게.
- **위키 보강(26.06.21 기획 반영)**: [게임 모드(거점 점령전)](./overview/game-mode.md) 신규 문서, 파밍 시스템·실리콘 슬로우(미구현)·크로스헤어 장탄 UI 기획을 백로그/HUD 문서에 반영.

### 2026-06-28 — SiliconGun 사격 포즈 + 위키 재구성

- **실리콘건 사격 포즈**: Fire 애니(`138179196835705`) 등록, 탄약비례 포즈 스크럽 + **연속사격 부들거림**(0→50발 램프, 손 떼면 리셋). → [FEAT-0004](./features/FEAT-0004-silicongun-fire-pose.md)
- **위키 재구성**: 사이드바 자동 접기(현재 섹션만 펼침), 게임 시스템 10개 → 4그룹(⚔️전투 / 🎨표현 / 🔁게임루프 / 🧱기반), 홈을 "지금 뭐 하려고 왔나요?" 행동형 허브로 — 가독성·집중도 개선.

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
- **2026-06-24** — 🧱 **전체 베이스라인 확립**: 총기 시스템·리깅·머즐·애니메이션 세트·구현 방식을 오늘 코드 기준으로 전부 문서화. 신규 [애니메이션 세트](./architecture/systems/presentation/animation-system.md), [구현 방식](./architecture/systems/foundation/implementation-conventions.md), [리깅·머즐](./architecture/systems/presentation/viewmodel-rigging.md)(근접·수류탄 포함). 이후 모든 변경은 이 기준점과 비교.
- **2026-06-24** — 전 총기(Compass·LegCrutch·Toaster·SiliconGun) 뷰모델 리깅·머즐 기준점 기록 — 머즐 파트·MeshId·Weld/Motor6D 허브 구조 표로 정리 → [리깅·머즐 문서](./architecture/systems/presentation/viewmodel-rigging.md)
- **2026-06-05** — 위키에 흑백 테마 적용, 카테고리 페이지에 하위문서 카드 추가 — 가독성·탐색성 개선
- **2026-06-05** — Roblox 코드 분석 문서화: [코드 구조](./architecture/code-structure.md), [무기 시스템](./architecture/systems/combat/weapon-system.md) 실수치 반영 — 구현과 문서 동기화
- **2026-06-05** — 게임 시스템 위키로 전면 개편(6대 카테고리 + 키워드 허브) — 코드 위 구조 레이어 확보
- **2026-06-04** — Docusaurus + GitHub Pages 위키 최초 구축, 노션 콘텐츠 이전 — 노션 무료플랜 한계 탈피

<!-- 새 항목은 이 위에 추가 (최신이 맨 위) -->
