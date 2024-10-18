/* eslint-disable class-methods-use-this */
import { Category, Owner, Payment } from '@/models/dtos';
import { type EntityTable } from 'dexie';
import BaseClient from '../client';
import dexieAction from './base';
import db from './db';

interface Entity {
  id: number | string;
}

export default class LocalClient extends BaseClient {
  async Get(endpoint: 'payments' | 'owners' | 'categories') {
    const table = db[endpoint] as unknown as EntityTable<Entity, 'id'>;

    const response = await dexieAction(table.toArray());
    return { data: response, error: null };
  }

  async Post(
    endpoint: 'payments' | 'owners' | 'categories',
    data: Payment[] | Category[] | Owner[]
  ) {
    const table = db[endpoint] as unknown as EntityTable<Entity, 'id'>;

    const response = await dexieAction(table.bulkAdd(data));
    return { data: !!response, error: null };
  }

  async Upload(): Promise<null | string> {
    return null;
  }

  async Put(
    endpoint: 'payments' | 'owners' | 'categories',
    payment: Payment[] | Category[] | Owner[]
  ) {
    const table = db[endpoint] as unknown as EntityTable<Entity, 'id'>;

    const response = await dexieAction(table.put(payment));
    return { data: !!response, error: null };
  }

  async Delete(endpoint: 'payments' | 'owners' | 'categories', ids: number[]) {
    const table = db[endpoint] as unknown as EntityTable<Entity, 'id'>;

    await dexieAction(table.bulkDelete(ids));
    return { data: true, error: null };
  }
}
