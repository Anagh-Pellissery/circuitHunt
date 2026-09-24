import { describe, it, expect } from 'vitest';
import { calculateSwapDelta, checkCircuitCompletion } from './gameLogic';

describe('gameLogic', () => {
  describe('calculateSwapDelta', () => {
    it('returns green + diff when currentPrice < boughtPrice', () => {
      const res = calculateSwapDelta(10, 15);
      expect(res).toEqual({ difference: 5, label: '+₹5', color: 'green' });
    });

    it('returns red - diff when currentPrice > boughtPrice', () => {
      const res = calculateSwapDelta(20, 15);
      expect(res).toEqual({ difference: -5, label: '-₹5', color: 'red' });
    });

    it('returns grey ₹0 when currentPrice == boughtPrice', () => {
      const res = calculateSwapDelta(15, 15);
      expect(res).toEqual({ difference: 0, label: '₹0', color: 'grey' });
    });
  });

  describe('checkCircuitCompletion', () => {
    it('returns true when all required components are owned', () => {
      const circuitRequired = ['c1', 'c2'];
      const inventory = {
        c1: { owned: true },
        c2: { owned: true },
        c3: { owned: false }
      };
      expect(checkCircuitCompletion(circuitRequired, inventory)).toBe(true);
    });

    it('returns false when a required component is not owned', () => {
      const circuitRequired = ['c1', 'c2'];
      const inventory = {
        c1: { owned: true },
        c2: { owned: false }
      };
      expect(checkCircuitCompletion(circuitRequired, inventory)).toBe(false);
    });

    it('returns false when a required component is completely missing from inventory', () => {
      const circuitRequired = ['c1', 'c2'];
      const inventory = {
        c1: { owned: true }
      };
      expect(checkCircuitCompletion(circuitRequired, inventory)).toBe(false);
    });

    it('returns false when inputs are empty or null', () => {
      expect(checkCircuitCompletion([], {})).toBe(true); // Technically true if required is empty
      expect(checkCircuitCompletion(null, {})).toBe(false);
      expect(checkCircuitCompletion(['c1'], null)).toBe(false);
    });
  });
});
