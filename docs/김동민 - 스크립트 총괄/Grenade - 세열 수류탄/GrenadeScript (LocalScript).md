# GrenadeScript (LocalScript)

```jsx
local Tool = script.Parent
local Player = game.Players.LocalPlayer
local Mouse = Player:GetMouse()
local Remote = game.ReplicatedStorage:WaitForChild("ThrowGrenade")

local THROW_FORCE = 120
local STRAIGHT_TIME = 0.3  -- 이 시간(초)동안 직선으로 날아감
local canThrow = true
local throwAnimId = "rbxassetid://522635514"
local trajectoryParts = {}
local isHolding = false
local equipped = false

local function clearTrajectory()
	for _, p in ipairs(trajectoryParts) do
		if p and p.Parent then p:Destroy() end
	end
	trajectoryParts = {}
end

local function getThrowParams()
	local camera = workspace.CurrentCamera
	local direction = (camera.CFrame.LookVector + Vector3.new(0, 0.2, 0)).Unit
	local character = Player.Character
	local rootPart = character and character:FindFirstChild("HumanoidRootPart")
	-- 카메라 위치 기준으로 눈 앞에서 생성
	local spawnPos = camera.CFrame.Position
		+ camera.CFrame.LookVector * 2      -- 앞으로
		+ camera.CFrame.RightVector * 1.5   -- 오른쪽으로
		+ camera.CFrame.UpVector * -0.2     -- 위로
	
	local velocity = direction * THROW_FORCE
	return spawnPos, velocity
end

local function showTrajectory()
	clearTrajectory()
	local spawnPos, velocity = getThrowParams()
	local adjustedVelocity = Vector3.new(velocity.X, velocity.Y + 30, velocity.Z)
	local gravity = Vector3.new(0, -workspace.Gravity, 0)

	for i = 1, 40 do
		local t = i * 0.1
		local point = spawnPos + adjustedVelocity * t + 0.5 * gravity * t * t

		local dot = Instance.new("Part")
		dot.Size = Vector3.new(0.2, 0.2, 0.2)
		dot.Position = point
		dot.Anchored = true
		dot.CanCollide = false
		dot.CastShadow = false
		dot.BrickColor = BrickColor.new("Bright yellow")
		dot.Material = Enum.Material.Neon
		dot.Shape = Enum.PartType.Ball
		dot.Parent = workspace
		table.insert(trajectoryParts, dot)
	end
end

-- 좌클릭 꾹 누르면 궤적, 떼면 던지기
Mouse.Button1Down:Connect(function()
	if not canThrow then return end
	if not equipped then return end
	isHolding = true
	while isHolding and canThrow do
		showTrajectory()
		task.wait(0.05)
	end
end)

Mouse.Button1Up:Connect(function()
	if not isHolding then return end
	if not equipped then return end
	isHolding = false
	clearTrajectory()

	if not canThrow then return end
	canThrow = false

	-- 애니메이션
	local character = Player.Character
	local humanoid = character and character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		local animator = humanoid:FindFirstChildOfClass("Animator")
		if animator then
			local anim = Instance.new("Animation")
			anim.AnimationId = throwAnimId
			local track = animator:LoadAnimation(anim)
			track:Play()
		end
	end

	Tool.Handle.Transparency = 1
	Tool.Handle.CanCollide = false

	local spawnPos, velocity = getThrowParams()
	Remote:FireServer(spawnPos, velocity)  -- 즉시 던지기

	task.wait(2)
	Tool.Handle.Transparency = 0
	Tool.Handle.CanCollide = true
	canThrow = true
end)

Tool.Equipped:Connect(function()
	equipped = true
end)

Tool.Unequipped:Connect(function()
	equipped = false
	isHolding = false
	clearTrajectory()
end)

Player.CharacterRemoving:Connect(function()
	equipped = false
	isHolding = false
	canThrow = true
	clearTrajectory()
end)

Player.CharacterAdded:Connect(function()
	isHolding = false
	canThrow = true
	clearTrajectory()
end)

game.Players.PlayerAdded:Connect(function(player)
	player.CharacterAdded:Connect(function(character)
		for _, part in ipairs(character:GetDescendants()) do
			if part:IsA("BasePart") then
				part.CollisionGroup = "Characters"
			end
		end
		character.DescendantAdded:Connect(function(part)
			if part:IsA("BasePart") then
				part.CollisionGroup = "Characters"
			end
		end)
	end)
end)
```