---
title: "BUG-0028 MeleeHitEvent 미존재로 근접 넉백 무효"
tags: [bug, weapon, combat]
---

# BUG-0028 — MeleeHitEvent 미존재로 근접 넉백 무효

| 항목 | 값 |
| --- | --- |
| 상태 | fixed |
| 심각도 | high |
| 관련 시스템 | 근접 넉백(MeleeKnockbackClient / 무기 ServerHandler) |
| 발견일 | 2026-08-05 |

## 증상

근접공격으로 **플레이어를 때려도 넉백이 안 밀렸다**. 콘솔에 다음 경고가 떴다.

```
Infinite yield possible on 'ReplicatedStorage.MeleeSystem.Remotes:WaitForChild("MeleeHitEvent")'
Script 'Players.Player1.PlayerScripts.MeleeKnockbackClient', Line 9
```

## 원인

넉백 설계는 "플레이어는 클라가 물리 권한이라 서버 속도가 무시됨 → 피격자 클라가 직접 넉백"이었고, 이를 위해 `MeleeSystem.Remotes.MeleeHitEvent`로 피격자에게 넉백 지시를 보내게 되어 있었다. 그런데 **`MeleeHitEvent` RemoteEvent 자체가 트리에 존재하지 않았다**(Remotes에 AttackEvent·BlockStateEvent·ShieldHPEvent만 있음).

- `MeleeKnockbackClient`는 `WaitForChild("MeleeHitEvent")` → **무한 대기**(리스너 미등록).
- 무기 ServerHandler들은 `FindFirstChild("MeleeHitEvent")` → nil이라 **서버 속도 폴백**(`_tp.AssemblyLinearVelocity = ...`). 그러나 플레이어 캐릭터는 클라가 물리 권한이라 서버가 준 속도가 **금방 무시됨** → 안 밀림.

## 조치

`ReplicatedStorage.MeleeSystem.Remotes`에 **`MeleeHitEvent`(RemoteEvent) 생성**.

- 이제 `MeleeKnockbackClient`가 정상 등록되어 `MeleeHitEvent`를 수신 → 피격자 클라가 직접 `LinearVelocity` 넉백 적용.
- 무기 ServerHandler는 피격 대상이 플레이어면 `MeleeHitEvent:FireClient(피격자, {shake, kx, kz, force})`, 봇이면 서버 속도(기존 폴백) 유지.

## 결과

근접(Dustpan 휘두르기 + 전 무기 V키)으로 플레이어를 때리면 피격자가 밀리고 화면 흔들림이 적용된다. 봇은 기존 서버 넉백 유지.

## 구현 위치

- `ReplicatedStorage.MeleeSystem.Remotes.MeleeHitEvent`(신설)
- `StarterPlayer.StarterPlayerScripts.MeleeKnockbackClient`(수신)
- 각 무기 `ServerHandler`(발신) · [FEAT-0024 근접 lunge](../features/FEAT-0024-melee-lunge.md)

## 재발 방지

- 코드가 참조하는 Remote/인스턴스는 **트리에 실제로 존재하는지** 배포 전 확인. `WaitForChild`가 무한 대기하면 그 이름의 인스턴스가 없다는 신호. → [LESSON-0005 조용한 실패 방지](../lessons/LESSON-0005-silent-failure.md)

## 변경 로그

- 2026-08-05: MeleeHitEvent 생성 → 근접 넉백 실동작.
