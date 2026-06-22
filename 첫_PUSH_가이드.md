# 첫 push 가이드 (딱 1번만 하면 됨)

> 이미 첫 push와 Pages 설정을 끝냈다면 이 문서는 넘어가도 됩니다.
> 평소에는 **`push.bat` 더블클릭** 한 번이면 업로드 + 사이트 반영이 됩니다.

## 1. 터미널 열기

`SchoolKing_wiki` 폴더에서 우클릭 → **터미널에서 열기** (또는 cmd에서 `cd` 로 이동)

## 2. 아래 명령어를 순서대로 실행

```bash
git init -b main
git add -A
git commit -m "위키 뼈대 세팅: Docusaurus + GitHub Pages 자동배포"
git remote add origin git@github.com:ghkdlxm005/SchoolKing_wiki.git
git push -u origin main
```

> **SSH 키가 없다고 에러가 나면?** (Permission denied)
> remote를 HTTPS로 바꾸면 브라우저 로그인으로 해결됩니다:
> ```bash
> git remote set-url origin https://github.com/ghkdlxm005/SchoolKing_wiki.git
> git push -u origin main
> ```

## 3. GitHub Pages 켜기 (1번만)

1. https://github.com/ghkdlxm005/SchoolKing_wiki/settings/pages 접속
2. **Source** 를 **GitHub Actions** 로 선택

## 4. 확인

1~2분 뒤 https://ghkdlxm005.github.io/SchoolKing_wiki/ 접속 → 위키가 보이면 성공!

---

## 다음부터는?

파일 수정 후 **`push.bat` 더블클릭** 한 번이면 끝.
(자동으로 커밋 + push + 사이트 반영)
