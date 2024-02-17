import { mockBudgets } from '@/lib/makeData';
import axios from 'axios';
import { Endpoint } from '@/constants';
import {
  baseApiCall,
  baseRequestData,
  makeBaseRequest,
} from '@/infrastructure/base-api';
import { Budget } from '@/models/dtos';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export async function GetBudgets(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Budgets, 'GET', signal);
  const { data, error } = await baseApiCall<Budget[]>({
    request: config,
    demoModeData: mockBudgets,
  });

  return { data: data ?? [], error };
}

export async function AddBudgets(budgets: Budget[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Budgets, 'POST', signal);
  config.data = baseRequestData(budgets);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return { data: data ?? false, error };
}

export async function EditBudget(budget: Budget, signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Budgets, 'PUT', signal);

  config.data = baseRequestData(budget);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return { data: data ?? false, error };
}

export async function DeleteBudgets(ids: number[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Budgets, 'DELETE', signal);
  config.data = baseRequestData(ids);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return { data: data ?? false, error };
}
