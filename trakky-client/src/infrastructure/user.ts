import { authAuthority, clientId } from '@/authConfig';
import { User } from 'oidc-client-ts';

export default function getUser() {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${authAuthority}:${clientId}`
  );

  if (!oidcStorage) {
    return null;
  }
  return User.fromStorageString(oidcStorage);
}
