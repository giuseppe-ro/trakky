import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Endpoint } from '@/constants';
import { onTransactionsUpload } from '@/lib/hooks/table-hooks';

const { upload } = vi.hoisted(() => ({ upload: vi.fn() }));

vi.mock('@/infrastructure/client-injector', () => ({
  Client: { Upload: upload },
}));

vi.mock('@/constants', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/constants')>();
  return { ...original, demoMode: false };
});

const row = {
  owner: 'a',
  type: 'b',
  date: '2024-01-31',
  amount: 5,
  description: 'd',
};

// jsdom's File has no text(), which every target browser has.
const file = (content: string) => {
  const f = new File([content], 'payments.json', { type: 'application/json' });
  f.text = () => Promise.resolve(content);
  return f;
};

describe('onTransactionsUpload', () => {
  beforeEach(() => upload.mockReset());

  it('does not upload a file that fails validation', async () => {
    await onTransactionsUpload(
      file(JSON.stringify([{ ...row, date: 'nope' }]))
    );
    expect(upload).not.toHaveBeenCalled();
  });

  it('does not upload a file that is not JSON', async () => {
    await onTransactionsUpload(file('{ not json'));
    expect(upload).not.toHaveBeenCalled();
  });

  it('uploads a valid file', async () => {
    upload.mockResolvedValue(null);
    await onTransactionsUpload(file(JSON.stringify([row])));
    expect(upload).toHaveBeenCalledWith(
      Endpoint.Payments,
      expect.any(File),
      undefined
    );
  });
});
