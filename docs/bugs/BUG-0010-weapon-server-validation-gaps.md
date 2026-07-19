---
title: "BUG-0010 무기 발사 서버 검증 구멍 3건"
tags: [bug, security, weapon]
---

# BUG-0010 — 무기 발사 서버 검증 구멍 3건

| 항목 | 값 |
| --- | --- |
| 상태 | **open** (미수정) |
| 심각도 | high (③은 critical) |
| 관련 시스템 | 무기/전투 (`*.ServerHandler`) |
| 발견일 | 2026-07-19 |

## 배경 — 현재 데미지 파이프라인

총기 4정(컴퍼스·목발·토스터·실리콘건)은 **서버 권위 히트스캔** 방식이다.

1. 클라이언트가 `FireEvent:FireServer(origin, direction)` 전송
   - `origin` = 카메라 위치
   - `direction` = **스프레드가 이미 적용된** 방향 벡터 (길이 = 사거리)
2. 서버가 검증 후 `workspace:Spherecast(origin, 0.4, direction)`
3. 맞은 파트 → 조상 Model → Humanoid
4. `dmg = Damage × 부위배율 × 거리감쇠`
5. `ShieldSystem.DealDamage(hum, dmg, player)` — 무적 체크 → 실드 흡수 → 잔여분 `TakeDamage`
6. `HitFeedbackEvent:FireClient(공격자)` — 데미지 숫자 표시

서버가 직접 레이캐스트하므로 **"맞았다"는 클라 주장은 신뢰하지 않는다.** 이 부분은 올바르다. 문제는 서버가 **레이캐스트의 입력값을 검증하지 않는다**는 점이다.

## 증상 (악용 시나리오)

정상 클라이언트에서는 문제가 없다. 조작된 클라이언트에서만 발생한다.

### ① `origin`을 검증하지 않음 — high

발사 핸들러는 `origin`이 실제 플레이어 위치 근처인지 확인하지 않는다. 타입과 `direction`의 길이만 본다.

```lua
if typeof(origin) ~= "Vector3" or typeof(direction) ~= "Vector3" then return end
if direction.Magnitude > config.MaxRange * 1.05 then return end
```

→ 맵 반대편 좌표를 `origin`으로 보내면 서버가 그 지점에서 레이캐스트한다. **벽 뒤·맵 밖에서 사격**이 가능하다.

> 같은 파일의 **근접공격(`MeleeEvent`)은 이 검증을 이미 하고 있다.**
> ```lua
> if hrp and (origin - hrp.Position).Magnitude > 8 then return end
> ```
> 발사 경로에만 누락됐다.

### ② `direction`이 실제 시선과 일치하는지 확인하지 않음 — high

스프레드(반동에 의한 탄 퍼짐)를 **클라이언트가 계산해서 최종 방향을 보낸다.** 서버는 길이만 본다.

→ 스프레드를 0으로 만들어 **무반동 사격**이 가능하고, 카메라가 어디를 보든 **임의의 대상에게 직접 조준**할 수 있다.

### ③ 토스터 펠릿 배열에 개수 상한이 없음 — **critical**

샷건인 토스터는 펠릿 여러 발이므로 `direction`을 **배열**로 받는다.

```lua
elseif type(direction) == "table" then
    for _, d in ipairs(direction) do
        if typeof(d) == "Vector3" then dirs[#dirs + 1] = d end
    end
end
if #dirs == 0 then return end          -- 하한만 있고 상한이 없음
...
state.mag -= 1                          -- 탄약은 1발만 차감
for _, d in ipairs(dirs) do             -- 펠릿마다 데미지
```

→ 배열에 펠릿 500개를 넣어 보내면 **탄약 1발로 500회 데미지**가 들어간다. 즉사 수준이다. 셋 중 가장 시급하다.

## 원인

무기 핸들러가 **"클라이언트는 연출만, 판정은 서버"** 원칙은 지켰지만, **판정에 쓰이는 입력값 자체가 클라이언트 제공값**이라는 점을 검증 대상에서 빠뜨렸다. 서버가 신뢰한 것은 "맞았다"가 아니라 "어디서, 어느 방향으로, 몇 발"이었다.

또한 4개 무기 핸들러가 **거의 동일한 코드를 복사**해서 쓰고 있어, 검증을 추가하려면 4곳을 모두 고쳐야 한다.

## 해결 (제안, 미적용)

| 구멍 | 대응 |
| --- | --- |
| ① origin | 근접공격과 동일하게 `(origin - hrp.Position).Magnitude` 상한 검사 |
| ② direction | 캐릭터가 보는 방향과의 각도 상한 검사 (스프레드 최대치 + 네트워크 여유) |
| ③ 펠릿 수 | `#dirs > config.PelletCount` 이면 거부 또는 잘라내기 |

근본적으로는 **4개 무기의 공통 발사 검증을 모듈 하나로 합치는 것**이 맞다. 지금 구조에서는 검증 하나 추가할 때마다 4곳을 동일하게 고쳐야 하고, 한 곳을 빠뜨리면 그 무기만 뚫린다.

## 재발 방지

**서버 권위는 "판정을 서버가 한다"로 끝나지 않는다. 판정의 입력값도 검증해야 한다.**

클라이언트에서 오는 값은 전부 공격자 제어 하에 있다고 가정한다 — 위치, 방향, 개수, 배열 길이 전부.

## 구현 위치

- `StarterPack.Compass.ServerHandler`
- `StarterPack.LegCrutch.ServerHandler`
- `StarterPack.Toaster.ServerHandler` (③ 해당)
- `StarterPack.SiliconGun.ServerHandler`

## 변경 로그

- 2026-07-19: 데미지 파이프라인 점검 중 발견. **미수정** — 우선순위 협의 필요.
