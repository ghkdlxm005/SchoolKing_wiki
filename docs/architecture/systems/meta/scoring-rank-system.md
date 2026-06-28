---
sidebar_position: 2
title: 점수 / 랭크 시스템 (Scoring & Rank)
tags: [system, event, ui]
---

# 점수 / 랭크 시스템

## 책임

처치 포인트 집계, 1등 판정·강조 효과, ESP, 리벤지 알림.

## 확정 규칙

- 데스매치 **포인트 기반**
- **1등 연속 킬 시**: 불타는 효과, 왕관, 짧은 ESP(0.5초), 재장전+이동속도 증가(1초)
  - 이 강화 상태의 1등을 잡으면 **2킬로 취급**
- 1등 ESP 발동 시, 나머지 플레이어에게 **1등 위치 1초 노출**
- **리벤지**: 가장 최근에 나를 죽인 적을 되갚으면 "리벤지를 당했습니다!" 알림

## 연결

처치 입력은 [전투/데미지 시스템](../combat/combat-damage-system.md), 표시는 [UI/HUD 시스템](../presentation/ui-hud-system.md).

#system #event #ui
