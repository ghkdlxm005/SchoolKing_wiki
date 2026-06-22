# Obsidian Vault 사용법 (개인 로컬 지식 저장소)

이 저장소의 `docs/` 폴더는 **그대로 Obsidian Vault**가 됩니다.
GitHub Pages가 보는 파일과 Obsidian이 보는 파일이 **완전히 동일**합니다 (단일 소스).

## 1. Vault 열기

Obsidian → **Open folder as vault** → 이 저장소의 **`docs` 폴더**를 선택.

> repo 전체를 열고 싶으면 repo 루트를 선택해도 되지만, 문서만 보려면 `docs/` 가 깔끔합니다.

## 2. 링크가 양쪽(Obsidian·Pages)에서 다 되게 설정 ⚙️

Obsidian → **Settings → Files & Links**:

| 설정 | 값 | 이유 |
| --- | --- | --- |
| Use `[[Wikilinks]]` | **끄기(OFF)** | Docusaurus는 `[[ ]]`를 못 읽음 |
| New link format | **Relative path** | `../bugs/BUG-0001.md` 형식이 양쪽에서 동작 |
| Automatically update internal links | 켜기 | 파일 이동 시 링크 자동 수정 |

이렇게 하면 Obsidian에서 만든 링크가 GitHub Pages에서도 그대로 작동합니다.

## 3. 태그 시스템 #️⃣

태그는 각 문서 맨 위 **프런트매터**에 적습니다 (Obsidian·Docusaurus 둘 다 인식).

```yaml
---
title: "BUG-0002 청소기 게이지 음수"
tags: [bug, weapon, ammo]
---
```

표준 태그:

| 태그 | 의미 |
| --- | --- |
| `#system` | 시스템 명세 문서 |
| `#feature` | 기능 이력 |
| `#bug` | 버그 기록 |
| `#lesson` | 재발 방지 규칙 |
| `#weapon` `#ammo` `#ui` `#event` `#spawn` `#combat` | 키워드(검색용) |

Obsidian 우측 **Tags** 패널 또는 검색창에 `tag:#bug` 로 모아볼 수 있습니다.

## 4. 그래프 뷰 🕸️

Obsidian의 **Graph View**로 문서 간 연결(버그↔시스템↔교훈)을 한눈에 봅니다.
링크를 많이 걸수록 그래프가 풍부해집니다.

## 5. 새 문서 만들 때

`docs/_templates/` 의 양식(`bug.md`, `feature.md`, `lesson.md`, `system.md`)을 복사해서
해당 폴더(`docs/bugs/` 등)에 `BUG-####-제목.md` 형식으로 저장하세요.

> `_templates` 폴더는 밑줄(`_`)로 시작해서 GitHub Pages에는 안 보이지만, Obsidian에서는 보입니다 — 양식 보관용으로 딱 좋습니다.

## 6. 동기화 흐름

```mermaid
flowchart LR
  Obsidian -- 저장 --> docsFolder[docs/ 파일]
  docsFolder -- push.bat --> GitHub[GitHub Repo]
  GitHub -- Actions --> Pages[GitHub Pages 사이트]
```

Obsidian에서 글을 고치면 → `push.bat` 더블클릭 → 1~2분 뒤 사이트 반영.
(Obsidian Git 플러그인을 쓰면 이 push도 자동화할 수 있습니다 — 선택사항.)
