# Grenade - 세열 수류탄

```jsx
ReplicatedStorage
└── ThrowGrenade (RemoteEvent)

ServerScriptService
└── GrenadeHandler (Script)  ← 서버: 수류탄 생성, 물리, 폭발, 데미지 처리

StarterPack
└── Grenade (Tool)            ← 새로 생성 필요
      ├── Handle (Part)        ← 손에 들리는 모양 (임시)
      │     └── SpecialMesh   ← 진짜 모델 가져오면 삭제 가능
      └── GrenadeScript (LocalScript)  ← 클라이언트: 던지기, 궤적, 애니메이션
```

[GrenadeHandler (Script)](GrenadeHandler%20%28Script%29.md)

[GrenadeScript (LocalScript)](GrenadeScript%20%28LocalScript%29.md)

**나중에 모델 교체할 때:**

1. Toolbox에서 수류탄 모델 가져오기
2. 모델 안의 메인 Part 이름을 **Handle** 로 변경
3. 기존 Handle이랑 SpecialMesh 삭제
4. 코드는 건드릴 필요 없음