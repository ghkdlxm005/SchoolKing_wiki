---
title: "BUG-0018 힐 도중 사망 시 healBusy 박제 → 책 안 먹힘"
tags: [bug, heal]
---

# BUG-0018 — 가끔 쉴드 까였는데 책(힐)이 안 써짐

## 증상

쉴드가 깎여 힐이 가능한 상태인데도, 가끔 4번(책 힐)을 눌러도 아무 반응이 없었다.

## 원인

`HealController.startHeal`은 `if healing or healBusy then return`으로 시작한다. `stopHeal`은 닫기 애니를 `task.spawn` 안에서 재생한 뒤 그 아래에서 `healBusy=false`를 푼다. **힐 도중 사망**하면 그 `task.spawn` 안의 닫기 애니 재생(`ct:Play()` 등)이 죽은 캐릭터에서 에러를 내며 스레드가 종료되고, 그 아래 `healBusy=false`에 도달하지 못한다. 결국 `healBusy`가 `true`로 박제되어 리스폰 후에도 모든 힐이 막혔다.

## 조치

- `stopHeal`의 닫기 애니 재생부를 `pcall`로 감싸 에러가 나도 이후 `healBusy=false`가 반드시 실행되게 함(닫기 애니 길이도 상한 캡).
- 리스폰(`CharacterAdded`)마다 `healing`/`healBusy`/`Healing` 어트리뷰트를 강제 초기화하는 안전장치 추가.

## 결과

힐 상태 박제가 해소되어, 쉴드가 깎였을 때 책이 안 먹히는 일이 사라졌다.
