# School KING Wiki

Roblox 게임 **School KING**의 공개 위키입니다. 게임 위키(모드·무기·조작)와 패치 노트만 다룹니다.

- 사이트: https://ghkdlxm005.github.io/SchoolKing_wiki/
- `main`에 Push하면 GitHub Actions가 자동으로 배포합니다 (1~3분).

## 어디를 고치나
| 내용 | 위치 |
| --- | --- |
| 패치 노트 (글 하나 = 업데이트 하나) | `patch-notes/YYYY-MM-DD-이름.md` |
| 위키 문서 | `docs/` (폴더 = 사이드바 분류) |
| 첫 화면 | `src/pages/index.js` |

패치 노트 새 글은 기존 글을 복사해서 날짜·`slug`·`title`·내용만 바꾸면 됩니다. 첫 문단 다음의 `<!-- truncate -->` 위가 목록에 보이는 요약입니다.

## 미리보기
`npm ci` → `npm start` (빌드 확인은 `npm run build`)

## 쓰지 않는 것
공개 저장소입니다. 스크립트 이름·코드 구조·보안 정보·팀 내부 내용은 쓰지 않습니다.
