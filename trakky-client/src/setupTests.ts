import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import { ReactNode } from 'react';
import 'fake-indexeddb/auto';

expect.extend(matchers);

// Mock the recharts ResponsiveContainer as it doesn't render correctly during tests.
vi.mock('recharts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.stubEnv('VITE_SERVER_URL', 'http://localhost:3000');

// Set demo mode to true during tests. This will make the API calls return fake data from the demo mode.
vi.stubEnv('VITE_DEMO_MODE', 'true');
