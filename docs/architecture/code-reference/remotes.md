---
title: Remote·Bindable 이벤트 (36)
sidebar_position: 3
tags: [architecture, reference, snapshot, event]
---

# Remote · Bindable 이벤트 — 36개 (2026-08-05)

`ReplicatedStorage` 직속의 통신 채널. 방향은 관례상 표기(RE=RemoteEvent, BE=BindableEvent). 상세 통신 규칙은 [event-system](../systems/foundation/event-system.md).

## BindableEvent — 클라 내부 입력 브로드캐스트 (7)

무기/이동 입력을 클라이언트 내부에서 여러 리스너에게 뿌리는 용도.

| 이름 | 용도 |
| --- | --- |
| Fire | 발사 입력 |
| Aim | 조준 입력 |
| Reload | 재장전 입력 |
| Melee | 근접공격 입력 |
| Slide | 슬라이드 입력 |
| Ability | 능력 사용 입력 |
| OpenLoadoutBindable | 로드아웃(Tab) 창 열기 |

## RemoteEvent — 클라↔서버 (29)

### 전투 · 무기

| 이름 | 방향(관례) | 용도 |
| --- | --- | --- |
| FireEvent | C→S | 발사 요청(서버 판정) |
| ReloadEvent | C→S | 재장전 |
| ThrowEvent | C→S | 수류탄 투척 |
| MeleeEvent | C→S | 근접 데미지·넉백 판정 |
| AttackEvent | C→S | 일반 공격 요청 |
| ToggleFireModeEvent | C→S | 발사 모드 전환 |
| EquipGrenadeEvent | C→S | 수류탄 장착 |
| AmmoUpdateEvent | S→C | 탄약/예비 갱신(전 무기 UI 공통) |
| HitFeedbackEvent | S→C | 명중 피드백(데미지 숫자·히트마커) |
| HitSoundEvent | S→C | 명중음 |
| VisualEffectEvent | S→C | 시각 효과 트리거 |

### 체력 · 쉴드 · 힐

| 이름 | 방향 | 용도 |
| --- | --- | --- |
| HealRequest | C→S | 힐 요청 |
| HealStateEvent | S→C | 힐 상태(진행/취소) |
| ShieldHPEvent | S→C | 쉴드 HP 갱신 |
| ShieldUpdate | S→C | 쉴드 표시 갱신 |
| BlockStateEvent | S→C | (구)방어 상태 — Dustpan 쉴드 삭제로 사실상 미사용 |

### 사망 · 리스폰 · 스폰

| 이름 | 방향 | 용도 |
| --- | --- | --- |
| DeathStateEvent | S→C | 사망 상태(데스캠 트리거) |
| RespawnRequest | C→S | 리스폰 요청(SPACE 등) |
| RespawnSoundEvent | S→C | 리스폰 사운드 |
| PlaySpawnRequest | C→S | PLAY 진입 스폰 요청 |
| KillFeedEvent | S→C | 킬로그 |

### 점수 · 상태 · 능력

| 이름 | 방향 | 용도 |
| --- | --- | --- |
| StateUpdateEvent | S→C | 일반 상태 동기화 |
| AbilityEvent | S→C | 능력(파워업) 발동/종료 |

### 매칭 · 로비 · 매치흐름

| 이름 | 방향 | 용도 |
| --- | --- | --- |
| MatchmakingStateEvent | S→C | 매칭 상태(Finding 등) |
| CancelMatchmakingEvent | C→S | 매칭 취소 |
| MatchFlowEvent | S→C | 매치 흐름(카운트다운·시작·종료) |
| LobbyStateEvent | S→C | 로비 상태 |

### 사운드 · 이동

| 이름 | 방향 | 용도 |
| --- | --- | --- |
| SlideSoundEvent | C→S | **슬라이드 시작 신호** → 서버가 sliding 3D 재생(SlideSoundServer) |
| Sound3DEvent | S→C | 3D 위치 사운드 재생 |

## 관련

- [event-system](../systems/foundation/event-system.md) · [스크립트 인벤토리](./script-inventory.md)
