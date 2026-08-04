---
title: "BUG-0021 스폰 직후 장착 시 1인칭 뷰모델 미생성"
tags: [bug, weapon, ui]
---

# BUG-0021 — 스폰 직후 장착 시 1인칭 뷰모델 미생성

| 항목 | 값 |
| --- | --- |
| 상태 | fixed (라이브 재검증 필요) |
| 심각도 | high |
| 관련 시스템 | 무기 ClientHandler / 뷰모델 |
| 발견일 | 2026-08-04 |

## 증상

태어나자마자(스폰 직후) 1번키로 주무기를 꺼내면 **1인칭 무기 모델이 안 보인다.** 다만 총알은 정상적으로 서버로 나가고 명중 판정도 된다. 여유를 두고(잠깐 뒤에) 꺼내면 뷰모델이 정상적으로 뜬다. 즉 "총은 나가는데 손에 아무것도 안 들려 보이는" 상태.

## 원인

무기 ClientHandler(LocalScript)는 스폰 때마다 도구와 함께 **새로 복제**되어, 상단에서 뷰모델 템플릿·애니메이션을 프리로드하고 여러 `WaitForChild`를 거친 뒤 **마지막에 `tool.Equipped`를 `Connect`** 한다.

스폰 직후 이 초기화가 끝나기 전에 장착이 일어나면(태어나자마자 1번키), `Equipped` 이벤트가 `Connect`보다 **먼저 발생해 유실**된다. 그 결과 장착 핸들러 안의 `setupViewmodel()`이 호출되지 않아 1인칭 뷰모델이 만들어지지 않는다. 발사 입력은 별도 경로(도구 활성화 → 서버 검증)라 총알은 그대로 나간다.

## 조치

7개 무기(LegCrutch·Compass·Cup·CAN·Dustpan·Toaster·SiliconGun) ClientHandler 말미에 **재장착 안전장치**를 추가했다.

- 초기화가 모두 끝난 시점(`task.defer`)에 도구가 이미 캐릭터에 장착돼 있는지 확인한다.
- 장착돼 있는데 카메라에 무기 뷰모델(`*_Local`)이 하나도 없으면, 잠깐 내렸다가(`UnequipTools`) 다시 장착(`EquipTool`)해 `Equipped`를 **정상적으로 다시 발생**시킨다. 이제는 핸들러가 연결돼 있으므로 `setupViewmodel()`이 호출된다.
- 뷰모델이 이미 존재하는 정상 장착 경로에서는 건너뛰므로 깜빡임이 없다.

## 결과

Studio Play에서 레이스를 재현해 검증했다. 스폰 직후 즉시 장착하면 수정 전에는 카메라에 기본 손 뷰모델(`Run_Viewmodel_Local`)만 남았지만, 수정 후에는 안전장치가 재장착해 `LegCrutchVM_Local`이 정상 생성됐다. **라이브(게시본) 재검증 권장.**

## 구현 위치

- `StarterPack.{LegCrutch, Compass, Cup, CAN, Dustpan, Toaster, SiliconGun}.ClientHandler` 각 스크립트 말미

## 관련

- [BUG-0012](./BUG-0012-viewmodel-left-behind.md) — 뷰모델이 남는 반대 케이스(정리 누락). 본 건은 뷰모델이 아예 안 생기는 케이스(생성 누락).

## 변경 로그

- 2026-08-04: 스폰 직후 Equipped 유실로 뷰모델 미생성 → 초기화 완료 후 뷰모델 부재 시 재장착하는 안전장치를 전 무기에 추가.
