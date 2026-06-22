// GitHub OAuth proxy for Decap CMS running on GitHub Pages.
// GitHub Pages cannot do the OAuth handshake by itself, so this tiny
// Cloudflare Worker does it. Deploy once; see CMS_로그인_설정_가이드.md.
//
// Endpoints:
//   /github/authorize  -> sends the user to GitHub's login screen
//   /github/callback   -> exchanges the code for a token and hands it to the CMS
//
// Required secrets (set in the Cloudflare dashboard or via wrangler):
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // Step 1: redirect the user to GitHub to log in.
    if (pathname === '/github/authorize') {
      const redirectUri = `${url.origin}/github/callback`;
      const target = new URL(AUTHORIZE_URL);
      target.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      target.searchParams.set('redirect_uri', redirectUri);
      target.searchParams.set('scope', searchParams.get('scope') || 'repo');
      target.searchParams.set('state', crypto.randomUUID());
      return Response.redirect(target.toString(), 302);
    }

    // Step 2: GitHub sends the user back here with a one-time code.
    if (pathname === '/github/callback') {
      const code = searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      const resp = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await resp.json();
      const ok = Boolean(data.access_token);
      const status = ok ? 'success' : 'error';
      const content = ok
        ? { token: data.access_token, provider: 'github' }
        : { error: data.error || 'no_access_token' };

      // Hand the token back to the CMS popup via postMessage.
      const body =
        '<!doctype html><html><body><script>' +
        '(function(){' +
        'function receive(e){' +
        "window.opener.postMessage('authorization:github:" +
        status +
        ':' +
        JSON.stringify(content) +
        "', e.origin);" +
        'window.removeEventListener("message", receive, false);' +
        '}' +
        'window.addEventListener("message", receive, false);' +
        "window.opener.postMessage('authorizing:github', '*');" +
        '})();' +
        '</script></body></html>';

      return new Response(body, {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      });
    }

    return new Response('SchoolKing CMS auth worker. Nothing here.', {
      status: 404,
    });
  },
};
