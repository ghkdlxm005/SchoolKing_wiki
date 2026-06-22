# CMS 로그인 설정 가이드 (운영자 1회 세팅)

친구들이 웹 편집기(`/admin`)에서 **GitHub으로 로그인** 버튼을 눌러 들어오게 하는 설정입니다.
한 번만 해두면 됩니다. 약 15분 걸립니다. 무료입니다.

> 이 작업에는 비밀번호·시크릿 키 입력이 들어갑니다. 그 부분은 **반드시 민지님이 직접** 입력해야 합니다(제가 대신 못 합니다).

---

## 준비물

- GitHub 계정 (이미 있음: `ghkdlxm005`)
- Cloudflare 계정 (없으면 https://dash.cloudflare.com/sign-up 에서 무료 가입)

---

## 1단계 — Cloudflare Worker 배포

Worker 코드는 이 폴더의 `cms-worker/worker.js` 에 있습니다. 두 가지 방법 중 편한 걸 고르세요.

### 방법 A — 대시보드에 붙여넣기 (쉬움, 추천)

1. https://dash.cloudflare.com 로그인 → 왼쪽 **Workers & Pages** → **Create** → **Create Worker**
2. 이름을 `schoolking-cms-auth` 로 정하고 **Deploy** 를 누릅니다(기본 코드 그대로 일단 배포).
3. 배포되면 **Edit code** 를 누르고, 기존 코드를 전부 지운 뒤 `cms-worker/worker.js` 내용을 붙여넣고 **Deploy**.
4. 배포 주소를 메모합니다. 예: `https://schoolking-cms-auth.내계정.workers.dev`

### 방법 B — 명령어(wrangler)

```bash
cd cms-worker
npx wrangler login
npx wrangler deploy
```

---

## 2단계 — GitHub OAuth 앱 만들기

1. https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. 아래처럼 입력:
   - **Application name**: `SchoolKing 위키 편집기`
   - **Homepage URL**: `https://ghkdlxm005.github.io/SchoolKing_wiki/`
   - **Authorization callback URL**: `https://<1단계 Worker 주소>/github/callback`
     예: `https://schoolking-cms-auth.내계정.workers.dev/github/callback`
3. **Register application** 클릭.
4. **Client ID** 를 복사해 둡니다.
5. **Generate a new client secret** 를 눌러 **Client Secret** 도 복사합니다. (이 값은 다시 못 보니 꼭 복사)

---

## 3단계 — Worker에 비밀값 넣기

Worker에 방금 만든 Client ID / Secret 를 알려줍니다.

### 대시보드에서

Cloudflare → 해당 Worker → **Settings** → **Variables and Secrets** → **Add**:

| 이름 | 값 | 종류 |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | (복사한 Client ID) | Secret |
| `GITHUB_CLIENT_SECRET` | (복사한 Client Secret) | Secret |

저장(Deploy) 합니다.

### 또는 명령어로

```bash
cd cms-worker
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

---

## 4단계 — 위키에 Worker 주소 연결

`static/admin/config.yml` 파일을 열어 `base_url` 한 줄을 본인 Worker 주소로 바꿉니다.

```yaml
  base_url: https://schoolking-cms-auth.내계정.workers.dev
```

그리고 `push.bat` 더블클릭으로 업로드하면 끝.

---

## 5단계 — 친구 초대

편집할 친구들은 각자 **GitHub 계정**이 필요합니다(무료 가입).
친구 아이디를 받아서:

https://github.com/ghkdlxm005/SchoolKing_wiki/settings/access → **Add people** → 친구 아이디 입력 → 권한 **Write** 로 추가.

---

## 확인

https://ghkdlxm005.github.io/SchoolKing_wiki/admin/ 접속 → **Login with GitHub** 버튼이 보이고,
누르면 GitHub 로그인 → 편집기 화면이 뜨면 성공입니다. 🎉

문제가 생기면 보통 **콜백 주소 오타**(2단계)거나 **base_url 오타**(4단계)입니다. 그 두 곳을 먼저 확인하세요.
