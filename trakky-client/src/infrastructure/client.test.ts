import { describe, expect, it } from 'vitest';

import { isOk } from '@/infrastructure/client';

describe('isOk', () => {
  it('is true when there is no error', () => {
    expect(isOk({ error: null })).toBe(true);
  });

  it('is false whenever there is an error, whatever the payload', () => {
    expect(isOk({ error: { error: 'x' } })).toBe(false);

    const created = { data: { count: 0 }, error: { error: 'x' } };
    expect(isOk(created)).toBe(false);
  });

  it('is true for a falsy payload with no error (LocalClient.Post shape)', () => {
    const added = { data: false, error: null };
    expect(isOk(added)).toBe(true);
  });
});
