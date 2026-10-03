import { AuthContextProps } from 'react-oidc-context';

export default async function logout(
  auth: Pick<AuthContextProps, 'signoutRedirect'>
): Promise<void> {
  await auth.signoutRedirect({
    post_logout_redirect_uri: window.location.origin,
  });
}
