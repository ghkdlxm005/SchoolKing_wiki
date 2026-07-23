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

아바타 타입을 R6에서 R15로 바꾼 뒤, 슬라이딩으로 벽에 돌진하면 그대로 통과함. R6에서는 정상적으로 벽에 막혔음.

## 원인

R6에서 R15로 바뀌면서 세 가지가 겹쳤다. 모두 `RootPart`가 R6에서는 Torso, R15에서는 HumanoidRootPart(HRP)로 달라진 데서 나온다.

1. 슬라이드 중 몸통 충돌까지 꺼짐
   - 슬라이드는 팔다리 끌림을 막으려고 RootPart를 제외한 전 파트의 CanCollide를 끈다.
   - R6: RootPart=Torso라서 Torso가 충돌을 유지 → 벽에 막힘.
   - R15: RootPart=HRP로 바뀌며 UpperTorso/LowerTorso 충돌까지 꺼짐. R15는 이 몸통 파트가 벽 충돌을 담당하므로 통과.

2. 지면 스냅이 물리 루트를 매 프레임 텔레포트
   - 슬라이드는 경사 대응을 위해 매 프레임 RootPart.CFrame을 바닥 높이로 세팅한다.
   - R6: RootPart=Torso(비-루트, 관절에 덮임)라 이 세팅은 무해했다.
   - R15: RootPart=HRP(진짜 물리 루트)라 매 프레임 캐릭터를 통째로 순간이동. 텔레포트는 충돌 해소를 건너뛰므로 통과.

3. LinearVelocity의 강한 force가 벽을 밀고 나감
   - 슬라이드 이동은 LinearVelocity 제약(MaxForce 축당 100000)으로 한다. 지그재그 방지용인데 벽 충돌보다 세서 밀어낸다.
   - 기존 "실제 속도가 목표의 40% 미만이면 종료" 판정은, force가 세서 벽에 박혀도 속도가 안 떨어져 작동하지 않았다.

## 조치

1. 몸통 충돌 유지 — KEEP_COLLIDE 화이트리스트(HumanoidRootPart/Torso/UpperTorso/LowerTorso)를 두고, 끌림을 유발하는 팔다리만 끈다. R6·R15 이름을 모두 포함.
2. 텔레포트 → 수직 속도 스냅 — RootPart.CFrame 세팅을 제거하고, AssemblyLinearVelocity.Y로 지면에 붙인다. 수평 이동은 물리엔진이 처리하므로 벽 충돌이 살아난다.
3. 전방 벽 레이캐스트 — 매 프레임 진행 방향으로 2.5스터드 레이를 쏴, CanCollide 벽이 감지되면 수평 속도를 0으로 만들고 슬라이드를 종료한다.

## 결과

세 조치 모두 적용 후 구문 검사 통과. 슬라이딩이 벽 앞에서 정지하도록 의도했으며, 실기 확인은 대기 중.

- 전방 감지 거리(2.5), SLIDE_ROOT_HEIGHT(1.8)는 R15 실기에서 튜닝 필요.
- R6에서는 무해했던 CFrame 세팅이 R15에서 물리 루트 텔레포트가 되는 점, 고 force 속도 제약이 벽을 뚫는 점은 다른 고속 이동기에도 적용되는 주의점.

## 구현 위치

- StarterPlayer.StarterCharacterScripts.SlideScript — setSlideCollision(몸통 유지), 지면 스냅(속도화), 전방 벽 레이캐스트

## 관련

- FEAT-0013 (R6 → R15 전환)

## 변경 로그

- 2026-07-23: 몸통 충돌 유지 + 텔레포트→속도 스냅 + 전방 벽 감지 3종 적용.
