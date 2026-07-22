---
title: "LESSON-0005 조용히 실패하는 코드를 만들지 않는다"
tags: [lesson]
---

# LESSON-0005 — 조용히 실패하는 코드를 만들지 않는다

## 규칙

### 1. `if not x then return end` 앞에서 멈춰 생각한다

nil 가드는 크래시를 막아준다. 동시에 **기능이 통째로 빠진 사실도 숨긴다.**

```lua
local _sfx = workspace:FindFirstChild("compass_sound")   -- 경로가 틀려서 nil
if _sfx then
    ... 사운드 바인딩 전체 ...
end
-- 에러 없음. 소리도 없음.
```

**있어야 정상인 것**이 없으면 조용히 넘기지 말고 `warn`을 남긴다.

```lua
if not _sfx then warn("[Compass] SFX.compass_sound 없음"); return end
```

**선택적인 것**(있으면 좋고 없어도 되는 것)만 조용히 넘긴다. 둘을 구분하는 게 핵심이다.

### 2. `FindFirstChild`는 동명 인스턴스 중 **하나만** 반환한다

맵에는 같은 이름이 여러 개인 경우가 흔하다 — 관중석, 조명, 문, 스폰.

```lua
-- 위험: 2개 중 1개만
local m = workspace:FindFirstChild("audience A")

-- 안전: 전부
for _, m in ipairs(workspace:GetChildren()) do
    if m:IsA("Model") and m.Name == "audience A" then ... end
end
```

**"하나뿐일 것"이라는 가정은 맵 작업 한 번이면 깨진다.**

### 3. 대상 판별은 이름 하드코딩이 아니라 특성으로

```lua
-- 취약: 맵이 재구성되면 새 그룹이 누락된다
if name == "audience A" or name == "audience B" then ...

-- 견고: 구성으로 판별
if humanoidCount > 0 and 관중스크립트만_있음 then ...
```

실제로 맵 작업자가 관중을 다시 묶자마자 이름 기준 제외가 무너져 **윤곽선 버그가 재발**했다.

### 4. 있어야 할 것이 다 있는지 **전수 점검**한다

한 개씩 콘솔에 뜰 때까지 기다리지 말고 한 번에 확인한다. 사운드 예시:

```lua
local CP=game:GetService("ContentProvider")
local f=Instance.new("Folder",game.ServerStorage)
local seen,probes={},{}
for _,d in ipairs(game:GetDescendants()) do
	if d:IsA("Sound") and d.SoundId~="" and not seen[d.SoundId] then
		seen[d.SoundId]=d:GetFullName()
		local s=Instance.new("Sound",f); s.SoundId=d.SoundId; s.Name=d.SoundId
		probes[#probes+1]=s
	end
end
pcall(function() CP:PreloadAsync(probes) end)
task.wait(2)
for _,s in ipairs(probes) do
	if s.TimeLength<=0 then warn("실패: "..s.Name.."  →  "..seen[s.Name]) end
end
f:Destroy()
print("점검 완료 — "..#probes.."개")
```

`TimeLength == 0`이면 로드 실패다. 툴박스 오디오를 넣을 때마다 돌린다.

> `PreloadAsync`의 콜백 상태값보다 **`TimeLength > 0`이 더 신뢰할 만하다.** 콜백이 성공으로 보고했는데 실제로는 로드되지 않은 사례가 있었다.

### 5. 정리 코드는 "정리할 주체가 살아 있을 때" 실행되어야 한다

Tool 안의 스크립트는 캐릭터와 함께 삭제된다. 자기 뒷정리를 스스로 보장할 수 없다.

| 정리 대상 위치 | 정리 시점 |
| --- | --- |
| 캐릭터 **안** | `CharacterRemoving` (파괴 **전**) |
| 캐릭터 **밖** (Camera, PlayerGui) | 캐릭터와 무관하게 사는 스크립트 |

`Humanoid.Died`만 믿으면 안 된다. `LoadCharacter`는 **죽음 없이** 캐릭터를 교체한다.

## 왜 (출처)

- [BUG-0013](../bugs/BUG-0013-compass-marker-sound-path.md) — 경로 오류 + nil 가드로 컴퍼스 사운드 13개가 **한 번도 재생되지 않음**. 에러가 없어 아무도 몰랐다.
- [BUG-0014](../bugs/BUG-0014-audience-outline-and-ambience.md) — `FindFirstChild`로 관중석 9곳 중 2곳만 소리, 이름 기준 제외로 799명에 윤곽선.
- [BUG-0012](../bugs/BUG-0012-viewmodel-left-behind.md) — 정리 스크립트가 정리 대상보다 먼저 삭제됨.

## 적용 대상

- 맵 오브젝트를 이름으로 찾는 모든 코드
- 외부 에셋(오디오·이미지·메시)을 참조하는 모든 코드
- 캐릭터 수명과 다른 수명을 가진 리소스(카메라 자식, PlayerGui, 월드 파트)
