# GrenadeHandler (Script)

```jsx
print("GrenadeHandler 실행됨!")
local PhysicsService = game:GetService("PhysicsService")

-- 충돌 그룹 생성
pcall(function()
	PhysicsService:RegisterCollisionGroup("Grenades")
	PhysicsService:RegisterCollisionGroup("Characters")
	PhysicsService:CollisionGroupSetCollidable("Grenades", "Characters", false)
end)

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remote = ReplicatedStorage:WaitForChild("ThrowGrenade")

local function explode(position)
	local BLAST_RADIUS = 15
	local MAX_DAMAGE = 100

	print("폭발!")

	local explosion = Instance.new("Explosion")
	explosion.Position = position
	explosion.BlastRadius = BLAST_RADIUS
	explosion.BlastPressure = 500000
	explosion.DestroyJointRadiusPercent = 0
	explosion.Parent = workspace

	for _, player in ipairs(game.Players:GetPlayers()) do
		local char = player.Character
		if not char then continue end
		local rootPart = char:FindFirstChild("HumanoidRootPart")
		local humanoid = char:FindFirstChild("Humanoid")
		if not rootPart or not humanoid then continue end
		local dist = (rootPart.Position - position).Magnitude
		if dist <= BLAST_RADIUS then
			local damage = MAX_DAMAGE * (1 - dist / BLAST_RADIUS)
			humanoid:TakeDamage(damage)
		end
	end
end

local function createGrenade(spawnPos)
	local body = Instance.new("Part")
	body.Name = "Grenade"
	body.CollisionGroup = "Grenades"  -- 이 줄 추가
	body.Parent = workspace
	body.Size = Vector3.new(0.55, 0.75, 0.55)
	body.CFrame = CFrame.new(spawnPos)
	body.BrickColor = BrickColor.new("Olive")
	body.Material = Enum.Material.Metal
	body.Anchored = false
	body.CanCollide = true
	body.CustomPhysicalProperties = PhysicalProperties.new(
		2,    -- 밀도 (무거울수록 잘 굴러감)
		0.2,  -- 마찰
		0.2,  -- 탄성
		0,    -- 마찰 가중치
		0     -- 탄성 가중치
	)
	body.Parent = workspace

	local mesh = Instance.new("SpecialMesh")
	mesh.MeshType = Enum.MeshType.Sphere
	mesh.Scale = Vector3.new(1, 1.3, 1)
	mesh.Parent = body

	return body
end

Remote.OnServerEvent:Connect(function(player, spawnPos, velocity)
	local body = createGrenade(spawnPos)
	body.Anchored = false
	-- 한 프레임도 기다리지 않고 바로 적용
	body.AssemblyLinearVelocity = Vector3.new(velocity.X, velocity.Y + 20, velocity.Z)

	task.delay(3, function()
		if body and body.Parent then
			local pos = body.Position
			body:Destroy()
			explode(pos)
		end
	end)
end)
```