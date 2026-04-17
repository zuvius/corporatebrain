import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackUsage, getTenantUsageStats, calculateCost } from './cost-tracker';

// Mock the database
vi.mock('@/lib/db/client', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(undefined),
    })),
    query: {
      usageLogs: {
        findMany: vi.fn(),
      },
    },
  },
}));

// Import after mock
import { db } from '@/lib/db/client';

describe('calculateCost', () => {
  it('calculates cost for gpt-4 correctly', () => {
    const cost = calculateCost('gpt-4', 1000, 500);
    expect(cost).toBeGreaterThan(0);
    // 1000 prompt tokens @ $0.03/1K = $0.03
    // 500 completion tokens @ $0.06/1K = $0.03
    // Total: $0.06
    expect(cost).toBeCloseTo(0.06, 3);
  });

  it('calculates cost for gpt-3.5-turbo correctly', () => {
    const cost = calculateCost('gpt-3.5-turbo', 1000, 500);
    expect(cost).toBeGreaterThan(0);
  });

  it('returns 0 for unknown model', () => {
    const cost = calculateCost('unknown-model', 1000, 500);
    expect(cost).toBe(0);
  });

  it('handles zero tokens', () => {
    const cost = calculateCost('gpt-4', 0, 0);
    expect(cost).toBe(0);
  });
});

describe('trackUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks usage successfully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const event = {
      tenantId: 'tenant-123',
      model: 'gpt-4',
      provider: 'openai',
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
      cost: 0.045,
      timestamp: new Date(),
      conversationId: 'conv-456',
    };

    await trackUsage(event);

    expect(db.insert).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Cost]')
    );
    
    consoleSpy.mockRestore();
  });

  it('handles tracking failure gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(db.insert).mockImplementation(() => {
      throw new Error('DB Error');
    });

    const event = {
      tenantId: 'tenant-123',
      model: 'gpt-4',
      provider: 'openai',
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
      cost: 0.045,
      timestamp: new Date(),
    };

    // Should not throw
    await expect(trackUsage(event)).resolves.not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('getTenantUsageStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns aggregated stats', async () => {
    const mockLogs = [
      {
        id: 'log-1',
        tenantId: 'tenant-123',
        model: 'gpt-4',
        cost: 0.045,
        totalTokens: 1500,
        promptTokens: 1000,
        completionTokens: 500,
        provider: 'openai',
        conversationId: 'conv-1',
        createdAt: new Date(),
      },
      {
        id: 'log-2',
        tenantId: 'tenant-123',
        model: 'gpt-3.5-turbo',
        cost: 0.002,
        totalTokens: 1000,
        promptTokens: 800,
        completionTokens: 200,
        provider: 'openai',
        conversationId: 'conv-2',
        createdAt: new Date(),
      },
    ];

    vi.mocked(db.query.usageLogs.findMany).mockResolvedValue(mockLogs);

    const stats = await getTenantUsageStats(
      'tenant-123',
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );

    expect(stats.totalCost).toBe(0.047);
    expect(stats.totalTokens).toBe(2500);
    expect(stats.queryCount).toBe(2);
    expect(stats.byModel['gpt-4']).toEqual({
      cost: 0.045,
      tokens: 1500,
      queries: 1,
    });
  });

  it('returns empty stats when no logs exist', async () => {
    vi.mocked(db.query.usageLogs.findMany).mockResolvedValue([]);

    const stats = await getTenantUsageStats(
      'tenant-123',
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );

    expect(stats.totalCost).toBe(0);
    expect(stats.totalTokens).toBe(0);
    expect(stats.queryCount).toBe(0);
    expect(stats.byModel).toEqual({});
  });

  it('aggregates multiple entries for same model', async () => {
    const mockLogs = [
      {
        id: 'log-1',
        tenantId: 'tenant-123',
        model: 'gpt-4',
        cost: 0.045,
        totalTokens: 1500,
        promptTokens: 1000,
        completionTokens: 500,
        provider: 'openai',
        conversationId: 'conv-1',
        createdAt: new Date(),
      },
      {
        id: 'log-2',
        tenantId: 'tenant-123',
        model: 'gpt-4',
        cost: 0.03,
        totalTokens: 1000,
        promptTokens: 700,
        completionTokens: 300,
        provider: 'openai',
        conversationId: 'conv-2',
        createdAt: new Date(),
      },
    ];

    vi.mocked(db.query.usageLogs.findMany).mockResolvedValue(mockLogs);

    const stats = await getTenantUsageStats(
      'tenant-123',
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );

    expect(stats.byModel['gpt-4'].queries).toBe(2);
    expect(stats.byModel['gpt-4'].cost).toBe(0.075);
    expect(stats.byModel['gpt-4'].tokens).toBe(2500);
  });
});
