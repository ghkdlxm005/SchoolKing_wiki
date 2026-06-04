# MugHandler (Script)

```jsx
print("MugHandler 실행됨!")

local PhysicsService = game:GetService("PhysicsService")

pcall(function()
	PhysicsService:RegisterCollisionGroup("Mugs")
	PhysicsService:RegisterCollisionGroup("Characters")
	PhysicsService:CollisionGroupSetCollidable("Mugs", "Characters", false)
end)

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remote = ReplicatedStorage:WaitForChild("ThrowMug")

local ZONE_RADIUS = 8
local ZONE_DAMAGE = 10
local ZONE_DURATION = 15

local function createZone(position)
	local zoneparts = {}  -- 함수 안에 선언

	local circle = Instance.new("Part")
	circle.Size = Vector3.new(1, 1, 1)
	circle.Anchored = true
	circle.CanCollide = false
	circle.BrickColor = BrickColor.new("Bright red")
	circle.Material = Enum.Material.Neon
	circle.Transparency = 0.5
	circle.Shape = Enum.PartType.Block

	local mesh = Instance.new("SpecialMesh")
	mesh.MeshType = Enum.MeshType.Cylinder
	mesh.Scale = Vector3.new(0.2, ZONE_RADIUS * 2, ZONE_RADIUS * 2)
	mesh.Parent = circle

	circle.CFrame = CFrame.new(position.X, position.Y + 0.1, position.Z) * CFrame.Angles(0, math.rad(90), math.rad(90))
	circle.Parent = workspace
	table.insert(zoneparts, circle)

	local elapsed = 0
	local connection
	connection = game:GetService("RunService").Heartbeat:Connect(function(dt)
		elapsed = elapsed + dt

		if math.floor(elapsed) > math.floor(elapsed - dt) then
			for _, player in ipairs(game.Players:GetPlayers()) do
				local char = player.Character
				if not char then continue end
				local rootPart = char:FindFirstChild("HumanoidRootPart")
				local humanoid = char:FindFirstChild("Humanoid")
				if not rootPart or not humanoid then continue end
				local dist = (Vector3.new(rootPart.Position.X, position.Y, rootPart.Position.Z) - position).Magnitude
				if dist <= ZONE_RADIUS then
					humanoid:TakeDamage(ZONE_DAMAGE)
				end
			end
		end

		if elapsed >= ZONE_DURATION then
			connection:Disconnect()
			for _, p in ipairs(zoneparts) do
				if p and p.Parent then p:Destroy() end
			end
		end
	end)
end

local function createMug(spawnPos)
	local body = Instance.new("Part")
	body.Name = "Mug"
	body.CollisionGroup = "Mugs"
	body.Size = Vector3.new(0.6, 0.8, 0.6)
	body.CFrame = CFrame.new(spawnPos)
	body.BrickColor = BrickColor.new("White")
	body.Material = Enum.Material.SmoothPlastic
	body.Anchored = false
	body.CanCollide = true
	body.CustomPhysicalProperties = PhysicalProperties.new(1, 0.3, 0.2, 0, 0)
	body.Parent = workspace

	local mesh = Instance.new("CylinderMesh")
	mesh.Scale = Vector3.new(1, 1, 1)
	mesh.Parent = body

	return body
end

Remote.OnServerEvent:Connect(function(player, spawnPos, velocity)
	print("서버: 머그컵 생성!")
	local body = createMug(spawnPos)
	body.AssemblyLinearVelocity = Vector3.new(velocity.X, velocity.Y + 30, velocity.Z)

	local exploded = false

	body.Touched:Connect(function(hit)
		if exploded then return end
		if hit:IsDescendantOf(player.Character) then return end
		exploded = true
		local pos = Vector3.new(body.Position.X, hit.Position.Y + hit.Size.Y / 2, body.Position.Z)
		body:Destroy()

		local explosion = Instance.new("Explosion")
		explosion.Position = pos
		explosion.BlastRadius = ZONE_RADIUS
		explosion.BlastPressure = 0
		explosion.DestroyJointRadiusPercent = 0
		explosion.Parent = workspace

		createZone(pos)
	end)

	task.delay(5, function()
		if not exploded and body and body.Parent then
			exploded = true
			local pos = body.Position
			body:Destroy()
			createZone(pos)
		end
	end)
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