--!strict
-- MeleeConfig
-- ReplicatedStorage.MeleeSystem.MeleeConfig
-- 근접무기(검+방패) 스탠을 한 곳에서 관리. setmetatable 상속 패턴 (GunConfig와 동일)

local MeleeConfig = {}

MeleeConfig.Default = {
	-- ===== 공공 =====
	DisplayName = "Melee",

	-- ===== 휠두르기 (종극 공격) =====
	SwingDamage = 25,                       -- 기본 데미지
	SwingRange = 6,                         -- 휠두르기 사거리 (stud)
	SwingArc = 90,                          -- 정면 ±관 각도 안 적 타격 (도)
	SwingCooldown = 0.5,                    -- 다음 휠두르기까지 쓰다운 (초)
	SwingDuration = 0.4,                    -- 애니메이션 길이
	SwingDelay = 0.15,                      -- 눌림 → 데미지 판정까지 지연 (휠두레서트)
	CanHitMultiple = true,                  -- true면 한 번 휠두르기에 여러 돍 타격 가능

	-- ===== 방패 (막기) =====
	ShieldEnabled = true,
	ShieldMaxHP = 100,                      -- 방패 최대 내구도
	ShieldRegenDelay = 3,                   -- 깨진 후 재생 시작까지 대기 (초)
	ShieldRegenRate = 25,                   -- 초당 회복량 (HP/sec)
	ShieldBlockAngle = 100,                 -- 정면 ±이 각도까지만 블락 가능 (도)
	ShieldDamageReduction = 1.0,            -- 1.0=완전차단, 0.5=50%감소, 0.0=안막음
	ShieldRaiseTime = 0.18,                 -- 방패 올리는 애니 길이
	ShieldLowerTime = 0.12,                 -- 내리는 애니 길이
	ShieldMoveSpeedMul = 0.7,               -- 방패 올린 상태 이동속도 배율

	-- 깨짐 효과
	ShieldBreakKnockback = 15,              -- 깨질 때 뒤로 밀리는 힘
	ShieldBreakStun = 0.6,                  -- 깨진 후 휠두르기 안됨 (초)

	-- ===== 애니메이션 ID (비워둔 건 자동 스킵) =====
	IdleAnim = "",
	EquipAnim = "rbxassetid://70934603796055",
	SwingAnim_1 = "",                       -- 휠두르기 1 (좌우 교대용)
	SwingAnim_2 = "",                       -- 휠두르기 2
	BlockRaiseAnim = "",
	BlockHoldAnim = "",
	BlockBreakAnim = "",

	-- ===== 사운드 =====
	SwingSound = "",                        -- 휠두르기 소리 (whoosh)
	HitSound = "",                          -- 돍 맞을 때
	BlockSound = "",                        -- 방패로 막았을 때 (clang)
	BlockBreakSound = "",                   -- 방패 깨질 때
	ShieldRegenStartSound = "",             -- 재생 시작 시

	-- ===== 걷기 바블 (이동 시 팸 흔들림) =====
	-- 양팔이 따로 움직이는 느낌이 주 목적
	WalkBobAmpHip = 0.04,                   -- 걸을 때 관 X 움직임시우웩 (stud)
	WalkBobAmpRun = 0.075,                  -- 달릴 때
	WalkBobVerticalRatio = 0.4,             -- Y는 X의 비율 (0~amp 범위, dip)
	WalkBobFreq = 4,                        -- 보행 주기 (클수록 빠른 스텍)
	WalkBobArmRollAmp = 0.06,               -- 팔이 좌우로 기울어지는 roll 각도 (rad)
	WalkBobArmPhaseOffset = math.pi,        -- 좌↔우 팔 위상 차 — π이면 완전 반대, π/2면 90° 차
	WalkBobBlockMul = 0.25,                 -- 방패 올린 상태 bob 감소 율 (팔이 더 안정되게)

	-- ===== LookSway (Xeradev 스타일) =====
	LookSwayAmount = -0.4,                  -- 기본 sway 강도 (음수 = lag 방향)
	BlockLookSwayAmount = -0.15,            -- 방패 들었을 때 sway 강도 (안정감)
	LookSwayLerp = 0.12,                    -- swayCF 보간 속도

	-- ===== 팔 웹드 규칙 (메쉬명 → 웹드 부착할 팔) =====
	-- 이 테이블에 있는 이름의 메쉬는 해당 팔의 Motor6D 따라감
	-- nil이면 HRP에 웹드 (기본 동작)
	ArmWeldMap = {
		handle = "RightArm",                -- 브러쉬 손잡이
		brush = "RightArm",                 -- 브러쉬
		body = "LeftArm",                   -- 쓰레받이 본체
		rubber = "LeftArm",                 -- 쓰레받이 고무
	},
}

-- 쓰레받이 + 솔 (검+방패)
MeleeConfig.Dustpan = setmetatable({
	DisplayName = "Dustpan & Brush",
	-- 새 리그: 쓰레받이는 Right Main/Left Main(축)에 template Weld로 연결됨 → 팔 직접 용접 제거(축 고정 방지)
	ArmWeldMap = {},
	-- 달리기 애니: 진입 시 재생 1회 → 1프레임 유지(무기 내림)
	RunAnim = "rbxassetid://71609837264681",
	RunHoldAnim = "rbxassetid://92638375107608",
	-- 공격(스윙) 애니
	SwingAnim_1 = "rbxassetid://134776635996855",
	SwingAnim_2 = "rbxassetid://134776635996855",
	SlideAnim = "rbxassetid://81035765089543",   -- 슬라이딩(슬라이드 중 유지)

	-- 휠두르기 — 솔로 치는 건 가벼움 (데미지 낮음, 빠르고 연속적)
	SwingDamage = 50,
		HitKnockback = 100,
	SwingRange = 11,
	SwingArc = 100,
	SwingCooldown = 0.4,
	SwingDuration = 0.35,
	SwingDelay = 0.12,

	-- 방패 — 쓰레받이는 평평해서 널승 (그래서 조금 잡아온다 가정)
	ShieldMaxHP = 80,
	ShieldRegenDelay = 4,                   -- 깨진 후 조금 더 오래 대기
	ShieldRegenRate = 20,                   -- 4초면 완전 재생
	ShieldBlockAngle = 110,
	ShieldDamageReduction = 0.85,           -- 15% 때면 조금 새는 느낌
}, { __index = MeleeConfig.Default })


-- 헬퍼: 누락된 키는 Default에서 자동으로 가져옴
function MeleeConfig.Get(name: string)
	local cfg = MeleeConfig[name]
	if not cfg then
		warn("[MeleeConfig] Unknown melee weapon: " .. tostring(name) .. ", falling back to Default")
		return MeleeConfig.Default
	end
	return cfg
end

return MeleeConfig
