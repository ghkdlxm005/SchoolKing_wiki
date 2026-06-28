---
title: 클라이언트-서버 모델
sidebar_position: 2
tags: [architecture, system, event]
---

# 클라이언트-서버 모델

## 원칙

- **서버 권위(Server Authority)**: 데미지, 사망, 아이템 생성, 점수는 서버가 최종 결정한다. 클라이언트는 "요청"만 한다.
- 클라이언트는 입력·예측·연출(애니메이션, 궤적)을 담당한다.

## 배치 규칙

| 위치 | 역할 |
| --- | --- |
| `ReplicatedStorage` | 공용 RemoteEvent/모듈 |
| `ServerScriptService` | 서버 권위 로직(데미지·생성·폭발) |
| `StarterPlayer/StarterPlayerScripts` | 클라이언트 입력·HUD |
| `StarterPack` / Tool | 무기 도구 + LocalScript |

통신 객체 목록은 [이벤트 시스템](./systems/foundation/event-system.md)에서 관리한다.
