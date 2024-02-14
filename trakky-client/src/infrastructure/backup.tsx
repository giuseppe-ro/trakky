import axios from 'axios';
import { mockBackup } from '@/lib/makeData';
import { Endpoint } from '@/constants';
import { baseApiCall, makeBaseRequest } from '@/infrastructure/base-api';
import { Backup } from '@/models/dtos';

axios.defaults.headers.post['Content-Type'] = 'application/json';

async function fetchBackup(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Backup, 'GET', signal);

  const { data, error } = await baseApiCall<Backup>({
    request: config,
    demoModeData: mockBackup,
  });

  return { data: data ?? null, error };
}

export default fetchBackup;
