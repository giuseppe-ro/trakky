import { describe, expect, it } from 'vitest';
import { getUserManager } from './userManager';

describe('getUserManager', () => {
  it('returns the same instance every time', () => {
    expect(getUserManager()).toBe(getUserManager());
  });

  it('is configured for Authentik silent renew and logout', () => {
    const { settings } = getUserManager();

    expect(settings.redirect_uri).toBe(`${window.location.origin}/`);
    expect(settings.silent_redirect_uri).toBe(
      `${window.location.origin}/silent-refresh.html`
    );
    expect(settings.post_logout_redirect_uri).toBe(window.location.origin);
    expect(settings.loadUserInfo).toBe(true);
    expect(settings.revokeTokensOnSignout).toBe(true);
  });
});
