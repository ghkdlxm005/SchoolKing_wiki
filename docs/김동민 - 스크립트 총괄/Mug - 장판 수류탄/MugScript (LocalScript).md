# MugScript (LocalScript)

```jsx
local Tool = script.Parent
local Player = game.Players.LocalPlayer
local Mouse = Player:GetMouse()
local Remote = game.ReplicatedStorage:WaitForChild("ThrowMug")

local THROW_FORCE = 120
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
	local spawnPos = camera.CFrame.Position
		+ camera.CFrame.LookVector * 2
		+ camera.CFrame.RightVector * 1.5
		+ camera.CFrame.UpVector * -0.2
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
		dot.BrickColor = BrickColor.new("Bright red")  -- 머그컵은 빨간 궤적
		dot.Material = Enum.Material.Neon
		dot.Shape = Enum.PartType.Ball
		dot.Parent = workspace
		table.insert(trajectoryParts, dot)
	end
end

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
	Remote:FireServer(spawnPos, velocity)

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
```