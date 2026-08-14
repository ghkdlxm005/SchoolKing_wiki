# Rojo 셋업 — 게임 코드를 game-source/ 로 뽑기

목표: Roblox Studio의 게임 스크립트를 이 저장소 `game-source/`에 파일로 뽑아 GitHub에서 참조·이력 관리한다.

개발은 계속 Studio에서(=Claude/MCP로) 하고, 코드를 **파일로 추출**하는 단계에서 Rojo 계열 도구를 쓴다.

---

## A. 한 번만: 전체 스크립트 추출 (rbxlx-to-rojo)

가장 간단한 "기존 place → 파일" 변환 도구는 **rbxlx-to-rojo**다.

1. **도구 설치**
   - 방법 1(권장, GUI): [rbxlx-to-rojo Releases](https://github.com/rojo-rbx/rbxlx-to-rojo/releases)에서 Windows 실행 파일(`rbxlx-to-rojo.exe`) 다운로드.
2. **place를 파일로 저장**
   - Studio에서 `파일 → 파일로 저장(Save to File)` → `SchoolKing.rbxlx`로 저장(확장자 **.rbxlx**, xml 형식이어야 함).
3. **변환 실행**
   - `rbxlx-to-rojo.exe` 실행 → 방금 저장한 `SchoolKing.rbxlx` 선택 → 출력 폴더 선택(예: 바탕화면 임시 폴더).
   - 결과: `src/`(또는 서비스별 폴더)에 모든 스크립트가 `.lua`로, 인스턴스 구조가 파일/폴더로 생성됨.
4. **게임 스크립트만 game-source/로 복사**
   - 출력에서 게임 자체 스크립트가 있는 폴더만 이 저장소 `game-source/` 아래로 복사한다:
     `ServerScriptService`, `ServerStorage`, `ReplicatedStorage`, `StarterGui`, `StarterPack`, `StarterPlayer`(단, `PlayerModule`/`CameraModule`는 로블록스 기본이라 제외).
   - `Workspace`의 서드파티 에셋 스크립트(맵·아이템 EasyConfiguration 등 1000+개)는 **제외**.
5. **커밋/푸시**: 루트 `push.bat` 실행 → GitHub 반영. 이후 diff로 변경 이력 확인.

> 참고: 도구가 파트/모델까지 JSON으로 뽑을 수 있는데, 여기선 **스크립트(.lua)만** 필요하다. `.lua` 파일 위주로 복사하면 된다.

## B. 이후 유지 (변경분 반영)

- 개발은 Studio(Claude/MCP)에서 하므로, **코드를 수정하면 Claude가 같은 세션에 `game-source/`의 해당 파일도 갱신**한다(루트 `CLAUDE.md` 규칙). 사용자는 push.bat로 올린다.
- 대규모로 다시 맞추고 싶으면 A단계(추출)를 재실행해 통째로 갱신해도 된다.

## C. (선택) 실시간 양방향 개발 — Rojo serve

파일을 소스오브트루스로 삼아 VS Code에서 개발하고 Studio에 실시간 반영하려면 Rojo를 쓴다. 현재 워크플로우(Studio 우선)에선 필수 아님.

1. Rojo CLI 설치(예: [Aftman](https://github.com/LPGhatguy/aftman) 또는 릴리스 바이너리), Studio에 **Rojo 플러그인** 설치.
2. 저장소 루트 `default.project.json`(이미 생성됨)로 서비스↔`game-source/` 매핑.
3. `rojo serve` 실행 후 Studio 플러그인에서 Connect → 파일 변경이 Studio에 반영됨.
   - 주의: Rojo는 기본적으로 **파일 → Studio** 방향이라, 파일이 비어 있으면 Studio를 덮어쓴다. 반드시 A단계로 파일을 먼저 채운 뒤 사용.
