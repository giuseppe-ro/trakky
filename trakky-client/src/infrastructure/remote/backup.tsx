import axios from 'axios';
import { Endpoint } from '@/constants';
import { callApi, makeBaseRequest } from '@/infrastructure/remote/base';
import { Backup } from '@/models/dtos';

axios.defaults.headers.post['Content-Type'] = 'application/json';

async function GetRemoteBackup(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Backup, 'GET', signal);

  const { data, error } = await callApi<Backup>({
    request: config,
  });

  return { data: data ?? null, error };
}

export default GetRemoteBackup;
