import { describe, expect, it, vi } from 'vitest';
import logout from './logout';

describe('logout', () => {
  it('keeps the stored user until the provider has signed out', async () => {
    const key = 'oidc.user:https://idp.example:trakky-client';
    localStorage.setItem(key, 'stored-user');

    const signoutRedirect = vi.fn(async () => {
      expect(localStorage.getItem(key)).not.toBeNull();
    });

    await logout({ signoutRedirect });

    expect(signoutRedirect).toHaveBeenCalledTimes(1);
    expect(signoutRedirect).toHaveBeenCalledWith({
      post_logout_redirect_uri: window.location.origin,
    });
  });
});
