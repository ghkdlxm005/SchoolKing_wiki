---
title: "BUG-0011 타격음 2종 재생 실패 (에셋 아카이브)"
tags: [bug, sound]
---

# BUG-0011 — 타격음 2종 재생 실패 (에셋 아카이브)

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (2026-07-19) |
| 심각도 | medium |
| 관련 시스템 | 사운드 / 전투 피드백 |
| 발견일 | 2026-07-19 |

## 증상

사격 중 콘솔에 반복 출력:

```
Failed to load sound rbxassetid://78181467453054: Requested asset is archived (x5)
Failed to load sound rbxassetid://98959105129079: Requested asset is archived (x4)
```

해당 소리가 **아예 나지 않는다.**

| 에셋 ID | 사운드 | 재생 시점 |
| --- | --- | --- |
| `78181467453054` | `Workspace.SFX.hit.shield_hit` | 상대 실드에 명중 |
| `98959105129079` | `Workspace.SFX.hit.hp_hit` | 실드가 깨진 뒤 체력에 명중 |

`(x5)`, `(x4)`로 누적되는 것은 명중할 때마다 로드를 재시도하기 때문이다.

## 원인

**코드 문제가 아니다.** `ShieldSystem` → `HitSoundEvent` → `HitSounds` 경로는 정상 동작하고, 사운드 인스턴스도 제자리에 있다.

로블록스 측에서 해당 오디오 에셋이 **보관(archived)** 상태로 전환되어 로드가 거부된다. 업로더가 직접 보관했거나 심의로 내려간 경우다.

> 이 두 개는 이번 작업에서 건드린 사운드가 아니다. 기존부터 있던 항목이며, 에셋 상태 변화로 뒤늦게 드러났다.

## 해결 (완료)

**보관 해제(Unarchive)로 복구됐다.** 2026-07-19 전수 점검에서 두 에셋 모두 정상 로드를 확인했다.

> 같은 원인(에셋 보관)으로 **컴퍼스 사운드 2종**도 죽어 있었다. 그쪽은 옛 재생 경로째로 정리했다. → [BUG-0013](./BUG-0013-compass-marker-sound-path.md)

### 참고 — 당시 검토했던 선택지

**A. 직접 업로드한 음원인 경우**

[크리에이터 대시보드](https://create.roblox.com) → Development Items → Audio → 해당 항목 **Unarchive**. 코드 수정 없이 즉시 복구된다.

**B. 타인 음원이거나 심의로 내려간 경우**

대체 음원을 확보해 `SoundId`를 교체한다. 교체 지점은 `Workspace.SFX.hit` 아래 두 인스턴스뿐이라 코드 수정은 불필요하다.

## 재발 방지

- 툴박스에서 가져온 오디오는 **언제든 내려갈 수 있다**고 가정한다. 핵심 피드백음(명중·처치)은 가능하면 직접 업로드한 에셋을 쓴다.
- 콘솔의 `Failed to load sound` 경고를 무시하지 않는다. 소리가 없다는 것은 **전투 피드백이 통째로 빠졌다**는 뜻이다.

## 구현 위치

- `Workspace.SFX.hit.shield_hit`
- `Workspace.SFX.hit.hp_hit`
- 재생 경로: `ServerScriptService.ShieldSystem` → `HitSoundEvent` → `StarterPlayer.StarterPlayerScripts.HitSounds`

## 변경 로그

- 2026-07-19: 발견. 보관 해제 필요로 판단.
- 2026-07-19: 보관 해제 확인 → **해결**. 게임 전체 사운드 59개 전수 점검에서 로드 실패 0건.
