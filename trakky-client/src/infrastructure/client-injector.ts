import { demoMode } from '@/constants';
import BaseClient from './client';
import GetLocalIcons from './local/icons';
import GetRemoteIcons from './remote/icons';
import RemoteClient from './remote/remote-client';
import LocalClient from './local/local-client';
import GetLocalBackup from './local/backup';
import GetRemoteBackup from './remote/backup';

function GetClient(): BaseClient {
  if (demoMode) {
    return new LocalClient();
  }

  return new RemoteClient();
}

function GetIconClient() {
  if (demoMode) {
    return GetLocalIcons;
  }

  return GetRemoteIcons;
}

function GetBackupClient() {
  if (demoMode) {
    return GetLocalBackup;
  }

  return GetRemoteBackup;
}

export const Client = GetClient();
export const GetIcons = GetIconClient();
export const GetBackup = GetBackupClient();
