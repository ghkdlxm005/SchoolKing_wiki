---
title: "LESSON-0009 판정 부피는 시각과 다르다 — 메시 스케일·시선 차단"
tags: [lesson]
---

# LESSON-0009 — 판정 부피는 시각과 다르다

## 규칙

### 1. `Size`만으로 시각 부피를 판단하지 않는다

`SpecialMesh.Scale`(과 `MeshType.Sphere` 등)은 렌더 크기를 파트 `Size`보다 몇 배 크게 만든다. 연막은 `Size` 2인 파트에 `Scale` 15~30이 걸려, **실제 보이는 구체는 반경 15~30스터드**였다. `part.Size` 기반 바운딩박스는 이 구름의 발끝(Y −17~−8)만 잡아, 그 위(Y 4)에 선 적을 "연막 밖"으로 흘렸다.

- 시각 부피 = `Size × Scale`. 판정도 여기에 맞춰야 한다.
- `Model:GetBoundingBox()`도 파트 `Size` 기준이라 메시 스케일을 반영하지 않는다.

### 2. 큰 뭉게구름은 하나의 박스(AABB)로 담기지 않는다

여러 겹치는 구체로 만든 구름을 단일 AABB로 근사하면 양쪽 다 틀린다.

- 코어(파트 `Size`)만 쓰면 → 가장자리에 선 적을 놓친다.
- 시각 전체(스케일 반영)를 한 박스로 쓰면 → 멀리 선 관찰자까지 박스 안에 들어와 "같은 연막"으로 오인된다.

정답은 **구성 요소(구체) 각각으로 판정**하는 것. 구름의 실제 모양을 그대로 따라간다.

### 3. "부피 안에 있나"가 아니라 "시선이 부피를 지나나"

은폐의 핵심은 위치 소속이 아니라 **시선 차단**이다.

```lua
-- 카메라 → 적 선분이 어떤 연막 구체를 지나면 숨김
-- (적이 연막 안 / 사이에 낌 / 내가 연막 안 — 모두 한 판정으로 커버)
local function segHitsSmoke(o, t, spheres)
    local d = t - o
    local len2 = d:Dot(d); if len2 < 1e-6 then return false end
    for _, sp in ipairs(spheres) do
        local f = sp.c - o
        local tt = math.clamp(f:Dot(d) / len2, 0, 1)
        local c = o + d * tt - sp.c
        if c:Dot(c) <= sp.r2 then return true end
    end
    return false
end
```

선분–구체 교차 하나로 세 경우를 다 처리한다. "안에 있나(AABB/구체 포함)"보다 의도에 정확하다.

### 4. 판정 로직을 바꿀 땐 실측으로 검증한다

이 문제는 화면 오버레이 디버그(`found/active/me/enemy/hide` + 실제 좌표)를 띄워 **실제 in/out 값**을 보고서야 원인이 잡혔다. 좌표 없이 추측으로 세 번 고쳤고 전부 빗나갔다. 판정·부피 문제는 실제 좌표를 찍어 검증한다.

## 왜 (출처)

- 연막 은폐([FEAT-0019](../features/FEAT-0019-smoke-concealment.md))가 "밖에서 안이 다 보임"으로 동작. 원인은 메시 스케일을 무시한 바운딩박스 판정. 구체 + 시선 차단으로 해결.

## 적용 대상

- 메시 스케일이 걸린 오브젝트의 충돌·판정·부피 계산
- 연막·장판·오라 등 "부피형" 게임플레이 판정
- 은폐·엄폐처럼 위치가 아니라 시선이 핵심인 규칙
