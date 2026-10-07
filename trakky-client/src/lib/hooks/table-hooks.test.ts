import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Endpoint } from '@/constants';
import {
  onTransactionsUpload,
  usePaymentsTable,
} from '@/lib/hooks/table-hooks';

const { upload, del } = vi.hoisted(() => ({ upload: vi.fn(), del: vi.fn() }));
const { toast } = vi.hoisted(() => ({ toast: vi.fn() }));

vi.mock('@/infrastructure/client-injector', () => ({
  Client: { Upload: upload, Delete: del },
}));

vi.mock('@/components/ui/use-toast', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@/components/ui/use-toast')>();
  return { ...original, toast };
});

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

describe('usePaymentsTable onDeleteConfirmed', () => {
  const props = {
    data: [],
    selectedYear: '2024',
    selectedMonth: 'All Months',
    refreshData: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => del.mockReset());

  it('toasts the server message when the delete fails', async () => {
    del.mockResolvedValue({ data: false, error: { error: 'Server Error.' } });
    const { result } = renderHook(() => usePaymentsTable(props));

    await act(async () => {
      await result.current.onDeleteConfirmed();
    });

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Couldn't delete transactions!",
        description: 'Server Error.',
        className: 'bg-red-500',
      })
    );
  });

  it('toasts success when the delete returns no error', async () => {
    del.mockResolvedValue({ data: false, error: null });
    const { result } = renderHook(() => usePaymentsTable(props));

    await act(async () => {
      await result.current.onDeleteConfirmed();
    });

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Transactions deleted!',
        className: 'bg-green-600',
      })
    );
    expect(toast).not.toHaveBeenCalledWith(
      expect.objectContaining({ className: 'bg-red-500' })
    );
  });
});
