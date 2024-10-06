/* eslint-disable class-methods-use-this */
import { Payment } from '@/models/dtos';
import { type EntityTable } from 'dexie';
import BaseClient from '../client';
import { dexieAction } from './base';
import db from './db';

export default class LocalClient extends BaseClient {
  async Get(endpoint: 'payments' | 'owners' | 'categories') {
    const table = db[endpoint] as EntityTable<Payment, 'id'>;

    const response = await dexieAction(table.toArray());
    return { data: response, error: null };
  }

  async Post(
    endpoint: 'payments' | 'owners' | 'categories',
    payments: Payment[]
  ) {
    const table = db[endpoint] as EntityTable<Payment, 'id'>;

    await dexieAction(table.bulkAdd(payments));
    return { data: true, error: null };
  }

  async Upload(): Promise<null | string> {
    return null;
  }

  async Put(endpoint: 'payments' | 'owners' | 'categories', payment: Payment) {
    const table = db[endpoint] as EntityTable<Payment, 'id'>;

    await dexieAction(table.put(payment));
    return { data: true, error: null };
  }

  async Delete(endpoint: 'payments' | 'owners' | 'categories', ids: number[]) {
    const table = db[endpoint] as EntityTable<Payment, 'id'>;

    await dexieAction(table.bulkDelete(ids as unknown as string[]));
    return { data: true, error: null };
  }
}
