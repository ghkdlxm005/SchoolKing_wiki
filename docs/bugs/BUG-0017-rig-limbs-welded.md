---
title: "BUG-0017 3인칭 리그 팔다리가 캐릭터에 웰드 (파란 몸)"
tags: [bug, rig]
---

# BUG-0017 — 3인칭 무기 들면 캐릭터가 파랗게

## 증상

컴퍼스·캔 등 3인칭 무기를 들면 캐릭터가 파란색으로 바뀌고, 애니메이션이 바뀔 때마다 팔다리가 제자리에 겹쳐 어긋나 보였다.

## 원인

`WeaponRig3P`는 제작자가 만든 3인칭 리그를 캐릭터에 이식하는데, 리그(`r15 compass`, `r15 can` 등)가 **전신 R15 캐릭터**였다. 무기/비무기 판별 목록(`NON_WEAPON`)에 R6 팔다리 이름과 R15 손·몸통만 있고 **R15 팔다리 세그먼트(UpperArm·LowerArm·UpperLeg·LowerLeg·Foot)가 빠져** 있어서, 그 파란 다리·팔 파트가 '무기'로 오인돼 캐릭터에 웰드됐다. 캐릭터 본체 팔다리는 애니로 움직이는데 웰드된 리그 팔다리는 제자리라 파랗게 겹쳐 보인 것.

## 조치

`WeaponRig3P.NON_WEAPON`에 R15 팔다리 10종을 추가:
`RightUpperArm, RightLowerArm, LeftUpperArm, LeftLowerArm, RightUpperLeg, RightLowerLeg, RightFoot, LeftUpperLeg, LeftLowerLeg, LeftFoot`.

## 결과

리그의 실제 무기 파트만 손에 붙는다. 컴퍼스·캔·컵·책·목발 등 모든 3인칭 리그에 공통 적용.
