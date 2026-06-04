# Mug - 장판 수류탄

```jsx
ReplicatedStorage
└── ThrowMug (RemoteEvent)

ServerScriptService
└── MugHandler (Script)
      - CollisionGroup "Mugs", "Characters" 설정
      - createZone(position) : 빨간 원형 장판 생성 + 15초 데미지 루프
      - createMug(spawnPos) : 흰색 실린더 머그컵 생성
      - OnServerEvent : 머그컵 생성 → 바닥 닿으면 즉시 폭발 + 장판 생성 → 5초 후 강제 폭발

StarterPack
└── Mug (Tool)
      ├── Handle (Part)
      │     └── CylinderMesh
      └── MugScript (LocalScript)
            - 좌클릭 꾹 누르면 빨간 궤적 표시
            - 좌클릭 떼면 던지기
            - 죽으면 궤적 자동 제거
            - 캐릭터와 충돌 없음
```

| 항목 | 값 |
| --- | --- |
| 던지는 힘 | 120 |
| 장판 범위 | 8 |
| 초당 데미지 | 10 |
| 장판 지속 | 15초 |
| 강제 폭발 | 5초 |

[MugScript (LocalScript)](MugScript%20%28LocalScript%29.md)

[MugHandler (Script)](MugHandler%20%28Script%29.md)