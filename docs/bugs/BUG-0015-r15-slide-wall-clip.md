---
title: "BUG-0015 R15 전환 후 슬라이딩 벽 통과"
tags: [bug, movement, rig]
---

# BUG-0015 — R15 전환 후 슬라이딩 벽 통과

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-23) |
| 심각도 | high |
| 관련 시스템 | 이동(SlideScript), R15 리그 |
| 발견일 | 2026-07-23 |

## 증상

R15로 전환한 뒤 **슬라이딩하면 벽을 그냥 통과**했다. R6에서는 정상이었다.

## 원인

세 가지가 겹쳤고, 셋 다 R6 → R15 전환의 부작용이다.

### ① 슬라이드 중 몸통 충돌까지 꺼짐

슬라이드는 다리 끌림을 막으려고 `RootPart`만 빼고 전 파트의 `CanCollide`를 끈다.

- R6: `RootPart = Torso` → **Torso가 충돌 유지** → 벽에 막힘
- R15 전환으로 `RootPart = HumanoidRootPart`가 되면서 **UpperTorso/LowerTorso 충돌까지 꺼짐**. R15에서 벽 충돌을 담당하는 게 바로 이 몸통 파트라, 전부 꺼지니 통과.

### ② 지면 스냅이 루트를 매 프레임 텔레포트 (핵심)

슬라이드는 경사 대응을 위해 매 프레임 지면 높이로 `RootPart.CFrame`를 세팅한다.

```lua
RootPart.CFrame = CFrame.new(_p.X, _newY, _p.Z) * RootPart.CFrame.Rotation
```

- R6: `RootPart = Torso`(웰드된 비-루트 파트) → 이 CFrame 세팅은 RootJoint에 덮여 **무해**했다.
- R15: `RootPart = HumanoidRootPart`(진짜 물리 루트) → **매 프레임 캐릭터를 통째로 순간이동**. 텔레포트는 충돌 해소를 건너뛰므로 벽을 통과한다.

### ③ LinearVelocity 고(高) force가 벽을 밀고 나감

슬라이드 이동은 `LinearVelocity` 제약으로 하는데 `MaxForce`가 축당 **100000**이다(지그재그 방지용). 이 힘이 벽 충돌보다 세서, 벽에 부딪혀도 **밀어서 통과**시킨다. 기존 "벽 막힘 → 종료" 판정(실제 속도가 목표의 40% 미만이면 종료)은, 힘이 세서 벽에 박혀도 속도가 안 떨어져 **작동하지 않았다.**

## 해결

세 가지를 각각 잡았다.

**① 몸통 충돌 유지** — `KEEP_COLLIDE` 화이트리스트(`HumanoidRootPart`/`Torso`/`UpperTorso`/`LowerTorso`)를 두어 몸통은 충돌을 유지하고, 끌림을 유발하는 **팔다리만** 끈다. R6·R15 이름을 모두 포함해 어느 리그에서도 안전.

**② 텔레포트 → 수직 속도 스냅** — 루트를 CFrame로 옮기지 않고 **수직 속도**로 지면에 붙인다.

```lua
local _vy = ((_targetY - _p.Y) * 0.5) / math.max(dt, 1/60)
_vy = math.clamp(_vy, -60, 60)
RootPart.AssemblyLinearVelocity = Vector3.new(initialDir.X * speed, _vy, initialDir.Z * speed)
```

수평 이동은 물리엔진이 처리 → 벽 충돌이 살아난다.

**③ 전방 벽 레이캐스트** — 매 프레임 진행 방향으로 2.5스터드 레이를 쏴, `CanCollide` 벽이 코앞이면 수평 속도를 0으로 죽이고 슬라이드를 종료한다. 고force가 벽을 뚫기 전에 멈춘다.

## 재발 방지

**`RootPart`의 의미가 R6(Torso)와 R15(HRP)에서 다르다.** R6에서 "비-루트 파트라 무해"했던 CFrame 세팅이 R15에서는 "물리 루트 텔레포트"가 된다. 물리 루트를 매 프레임 CFrame로 옮기지 말고 **속도로 제어**한다.

또한 **속도 제약(LinearVelocity)의 MaxForce가 지나치게 높으면 벽을 뚫는다.** 고속 이동기는 반드시 전방 충돌 감지를 함께 둔다.

→ R15 전환 전반: [FEAT-0013](../features/FEAT-0013-r6-to-r15-migration.md)

## 구현 위치

- `StarterPlayer.StarterCharacterScripts.SlideScript` — `setSlideCollision`(몸통 유지), 지면 스냅(속도화), 전방 벽 레이캐스트

## 변경 로그

- 2026-07-23: 몸통 충돌 유지 + 텔레포트→속도 스냅 + 전방 벽 감지 3종 적용.
