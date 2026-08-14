---
title: "FEAT-0029 근접무기 뷰모델·애니·이동 시스템 (Dustpan)"
tags: [feature, weapon, viewmodel, movement]
---

# FEAT-0029 — 근접무기 뷰모델·애니·이동 시스템 (Dustpan)

| 항목 | 값 |
| --- | --- |
| 상태 | 구현 · 라이브 검증 대기 |
| 시스템 | weapon / viewmodel / movement |
| 관련 | [FEAT-0024 근접 돌진](./FEAT-0024-melee-lunge.md), [FEAT-0014 뷰모델 벽 관통](./FEAT-0014-viewmodel-wall-clip.md), [FEAT-0013 R6→R15](./FEAT-0013-r6-to-r15-migration.md) |
| 날짜 | 2026-08-15 |

> 이 문서는 **코드 구조 레퍼런스**다. 근접무기(현재 Dustpan)의 뷰모델 리그·애니메이션·이동속도가 어떤 파일의 어디에서 어떻게 동작하는지 정리해, 다음 작업 때 재조사 없이 참조·수정할 수 있게 한다. 개발 경위는 [ai-log 2026-08-15](../ai-log/2026-08-15.md).

## 구성 파일

| 파일 | 역할 |
| --- | --- |
| `StarterPack.Dustpan.ClientHandler` (LocalScript) | 1인칭 뷰모델 부착·애니 재생·입력(좌클릭 스윙)·달리기/슬라이딩 애니 워처 |
| `StarterPack.Dustpan.ServerHandler` | 서버측 판정(데미지·쉴드) |
| `ReplicatedStorage.MeleeSystem.MeleeConfig` (ModuleScript) | 무기별 설정(애니 ID·데미지·속도 등). `Dustpan`이 `Default`를 상속 |
| `ReplicatedStorage.Viewmodels.DustpanVM` (Model) | 1인칭 뷰모델 리그(팔+쓰레받이+Animator) |
| `StarterPlayer.StarterCharacterScripts.SlideScript` | 걷기/달리기/슬라이딩 상태·이동속도(근접무기 이속 보너스 포함) |

## 뷰모델 리그 구조 (DustpanVM)

**양손 파지 구조** — 쓰레받이가 두 개의 중간 "축 파트"를 통해 양팔에 연결된다.

```
HumanoidRootPart (PrimaryPart, Anchored)
├─ Motor6D LeftArm  : HRP → LeftArm(팔 메쉬)
│   └─ Motor6D Left Main : LeftArm → Left Main(축 파트)
│        ├─ Weld body   (쓰레받이 본체)
│        └─ Weld rubber (고무)
├─ Motor6D RightArm : HRP → RightArm(팔 메쉬)
│   └─ Motor6D Right Main : RightArm → Right Main(축 파트)
│        ├─ Weld brush  (솔)
│        └─ Weld handle (손잡이)
├─ AnimationController + Animator (애니 재생)
└─ FakeCamera (카메라 정렬 기준점 — CamPart)
```

핵심: **애니메이션은 `Left Main`/`Right Main`(축)의 Motor6D를 회전**시켜 쓰레받이를 움직인다. 쓰레받이 파트(body·brush·handle·rubber)는 이 축에 Weld로 매달려 축을 따라간다. 팔 배치(RightArm이 Z로 앞으로 튀어나옴 등)는 **의도된 리깅**이다.

## 자동 weld (setupViewmodel) — ★주의점

`ClientHandler.setupViewmodel()`은 클론된 뷰모델을 camera에 붙이며, "아직 조인트로 안 붙은 파트"를 HRP에 fallback weld한다. 이 판정이 잘못되면 쓰레받이가 **축이 아니라 HRP/팔에 고정돼 애니를 안 따라간다**(과거 "축 고정" 버그).

- **rigged 판정에 `Motor6D`뿐 아니라 `Weld`/`WeldConstraint`도 포함**해야 한다. 그래야 Weld로 축에 붙은 쓰레받이 파트가 HRP에 재고정되지 않는다.
- **`config.ArmWeldMap`은 Dustpan에서 `{}`(비움)**. Default의 ArmWeldMap은 쓰레받이를 팔에 직접 용접하는 구(舊) 구조용인데, 새 축 리그와 충돌해 축을 잠근다. → Dustpan 항목에서 `ArmWeldMap = {}`로 override.

## 애니메이션 시스템

`ClientHandler`가 `MeleeConfig.Get("Dustpan")`의 애니 ID를 `AnimMap`으로 모아 `AnimatorLoadAnimation`으로 로드하고, `AnimSettings`(looped·priority·speed)로 재생한다.

| 상태 | 애니 | ID | 배속 | 우선순위 | 처리 |
| --- | --- | --- | --- | --- | --- |
| Idle(정지·걷기) | — | (없음) | — | — | **리그 기본 포즈**(애니 미재생). IdleAnim 비움 |
| 장착 | 들기(Equip) | 70934603796055 | 1 | Action | 1회 재생 후 리그 기본 복귀 |
| 공격 | 공격(Swing_1/2) | 134776635996855 | **2** | Action | 좌클릭 시 재생 |
| 달리기 진입 | 재생(Run) | 71609837264681 | **1.5** | Movement | 1회 재생 → 1프레임 유지 |
| 달리기 유지 | 1프레임(RunHold) | 92638375107608 | 1 | Movement | 재생 종료 후 마지막 프레임 유지(무기 내림) |
| 슬라이딩 | 슬라이딩(Slide) | 81035765089543 | 1 | Movement | 재생 후 마지막 프레임 유지 |

**달리기/슬라이딩 워처**(`startRunWatch`, 캐릭터 `IsRunning`/`IsSliding` 어트리뷰트 감지):

- `IsSliding` → `playSlide()` (슬라이딩 우선). 슬라이드 종료 시 정지.
- `IsRunning` → `playRunSeq()`: 재생(1.5배속) 1회 → 끝나면 1프레임 유지. 해제 시 정지(리그 기본).
- **달리기 복귀 규칙**: 슬라이딩 후 달리기 복귀(`IsRunning` false→true) 시 재생 재적용. **공격 후에도** 스윙 완료 시 `IsRunning`이면 `playRunSeq()` 재호출.
- `IsRunning`/`IsSliding`은 `SlideScript`가 세팅. 실제 입력(Shift 등) 없이 Studio에서 강제로 세팅하면 SlideScript가 즉시 되돌리므로, 라이브 검증이 필요.

## 이동속도 (SlideScript)

기본 상수: `WalkSpeed=16`, `RunSpeed=24`, `CrouchSpeed=8`, `SlideForce=50`.

상태별 목표속도 `targetSpeedFor(st)` = `baseSpeedForState(st) + speedBonus() + meleeSpeedBonus() - SlowAmount`.
- `speedBonus()` = Monster Energy 등 외부 `SpeedBonus` 어트리뷰트.
- **맨손 달리기 +3**: 달리기 상태 & Tool 없을 때 base +3(원래 로직).

### 근접무기 이속 보너스 (`meleeSpeedBonus`)

근접무기(장착 Tool에 `MeleeName` 자식이 있으면 근접으로 판정) 장착 시 **+3**:
- **걷기**: 16 → **19**
- **달리기**: 24 → **27** (맨손 달리기 +3과 동일 대우 — 무기 들면 못 받던 +3을 근접무기는 받음. Tool 있으면 맨손 +3 로직은 스킵되므로 중복 없음)
- **슬라이딩(비례)**: `slideSpeed = SlideForce + … + SlideForce × (3 / RunSpeed)` = 50 + 50×(3/24) ≈ **+6.25** (달리기 증가율 +12.5%와 동일 비율)

툴 장착/해제 시 `Character.ChildAdded/ChildRemoved`(Tool) 훅으로 이속 즉시 재적용.

## 사망/정리

- 사망·언장착·캐릭터 제거 시 `destroyViewmodel()`이 뷰모델·애니·달리기 워처를 정리(잔존 뷰모델 방지).
- 사망/데스캠 중 무기 재장착 차단은 별도 `StarterPlayerScripts.DeadWeaponBlock` 담당.

## 남은 것 / 라이브 검증 필요

- 지속 달리기(재생 1회 후 1프레임 유지), 슬라이드→달리기·공격→달리기 복귀 시 재생 재적용의 **실제 타이밍**(Studio 입력 제한으로 코드·격리 검증만 됨).
- 근접 달리기 27·슬라이딩 비례 속도의 체감(걷기 19·해제 16은 Play 검증됨).
- 다른 근접무기 추가 시: `MeleeName` 값이 있으면 이속 보너스는 자동 적용. 뷰모델은 동일한 축(Weld) 리그 규칙을 따라야 함.
