import { AccessContext, HttpClient, OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';

export const lichessHost = 'https://lichess.org';
export const clientId = 'blindfoldchess.dev';
export const clientUrl = (() => {
  const url = new URL(document.location.href);
  url.search = '';
  return url.href;
})();

export class LichessCtrl {
  oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${lichessHost}/oauth`,
    tokenUrl: `${lichessHost}/api/token`,
    clientId,
    scopes: ['challenge:write', 'bot:play', 'board:play'],
    redirectUrl: clientUrl,
    onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
    onInvalidGrant: () => {},
  });

  error?: any;

  accessContext?: AccessContext;

  token?: string;

  name?: string;

  async login() {
    await this.oauth.fetchAuthorizationCode();
  }

  async init() {
    try {
      const hasAuthCode = await this.oauth.isReturningFromAuthServer();
      if (hasAuthCode) {
        this.accessContext = await this.oauth.getAccessToken();
        this.token = this.accessContext?.token?.value;

        const fetch = this.oauth.decorateFetchHTTPClient(window.fetch);
        await this.getUsername(fetch);
      }
    } catch (err) {
      this.error = err;
    }
  }

  async getUsername(fetch: HttpClient) {
    const res = await fetch(`${lichessHost}/api/account`);
    this.name = (await res.json()).username;
  }

  async logout() {
    const token = this.accessContext?.token?.value;
    this.accessContext = undefined;
    this.error = undefined;

    await fetch(`${lichessHost}/api/token`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
