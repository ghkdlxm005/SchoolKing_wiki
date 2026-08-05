---
title: Code Reference (스냅샷)
sidebar_position: 1
tags: [architecture, reference, snapshot]
---

import DocCardList from '@theme/DocCardList';

# Code Reference — 현재 코드 스냅샷

Roblox Studio의 현재 데이터모델에서 **직접 긁어온** 구조 스냅샷이다. 개념 설명은 상위 [System Architecture](../index.md) 문서에 있고, 여기는 **실제로 존재하는 스크립트·이벤트·값**을 그대로 나열한다. 요약 과정에서 세부가 흐려지면 이 문서를 기준으로 대조한다.

> **스냅샷 기준일: 2026-08-05.** 코드가 바뀌면 이 스냅샷도 다시 뜬다(재생성 방법은 아래).

## 한눈에

| 항목 | 수치 | 문서 |
| --- | --- | --- |
| 스크립트(Script/LocalScript/ModuleScript) | 91개 | [스크립트 인벤토리](./script-inventory.md) |
| RemoteEvent / BindableEvent | 36개 | [Remote·Bindable](./remotes.md) |
| 캐릭터/플레이어 어트리뷰트 | 66개 | [어트리뷰트](./attributes.md) |
| 무기/수류탄/근접/매칭 설정값 | 4개 모듈 | [설정값](./config-values.md) |
| 맵 상호작용 요소 · 사운드 | Rope_act·유리벽·문·SFX | [맵·사운드](./map-and-sfx.md) |

## 최상위 구조 (스크립트가 사는 곳)

```
ReplicatedStorage
├─ GunSystem        (GunConfig, Recoil, SpreadState)
├─ MeleeSystem      (MeleeConfig)
├─ GrenadeSystem    (GrenadeConfig)
├─ SharedFX         (MeleeLunge, RunTilt, SlideTilt, ThirdPersonAnims, WeaponRig3P)
├─ Viewmodels       (무기별 1인칭 뷰모델 리그)
├─ ClientSFX        (클라 사운드 헬퍼)
├─ MatchmakingConfig
└─ [RemoteEvent 36종]

ServerScriptService  (거점·전투·리스폰·힐·매칭·환경 등 서버 권위 시스템)
StarterPack          (무기 7종: 각 ClientHandler + ServerHandler)
StarterPlayer
├─ StarterPlayerScripts   (카메라·HUD·이동사운드·이펙트·그래플 등 40+ LocalScript)
└─ StarterCharacterScripts (SlideScript = 이동 상태머신, Health)
StarterGui           (GameHUD/HUDController, GunUI)
Workspace            (맵·SFX 폴더·거점·Rope_act·유리벽·문·소화기 등)
```

## 서버 권위 원칙

데미지·생성·판정·점수·스폰은 **서버(ServerScriptService + 각 무기 ServerHandler)** 가 확정한다. 클라이언트는 입력·연출·뷰모델·사운드만 담당한다. 자세한 규칙은 [클라이언트-서버 모델](../client-server-model.md).

## 이 스냅샷 다시 뜨는 법

Studio가 켜진 상태에서 `execute_luau`(Edit)로:

1. **스크립트 인벤토리** — 컨테이너들을 순회하며 `LuaSourceContainer`의 경로·ClassName·라인수 수집.
2. **Remote** — `ReplicatedStorage:GetDescendants()`에서 `RemoteEvent/RemoteFunction/BindableEvent` 필터.
3. **어트리뷰트** — 각 스크립트 소스에서 `[GS]etAttribute("이름")` 정규식 추출 후 유니크.
4. **설정값** — `require(GunConfig/MeleeConfig/GrenadeConfig/MatchmakingConfig)` 후 스칼라 필드 나열.
5. **맵·SFX** — `workspace`/`workspace.SFX` 순회.

> 큰 소스(Compass 3822줄 등)를 한 번에 다중라인으로 뽑으면 MCP가 타임아웃 나므로 **컨테이너별로 나눠** 뜬다.

## 하위 문서

<DocCardList />
