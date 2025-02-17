import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { walletCoreService } from '../lib/walletcore';
import { ethers } from 'ethers';

interface Stake {
  id: string;
  plan: string;
  amount: number;
  daily_yield: number;
  start_date: string;
  end_date: string;
  status: string;
  total_earned: number;
  last_payout: string;
  deposit_address?: string;
}

interface StakingState {
  stakes: Stake[];
  loading: boolean;
  error: string | null;
  fetchStakes: () => Promise<void>;
  createStake: (plan: string, amount: number, dailyYield: number) => Promise<string>;
  restake: (stakeId: string) => Promise<void>;
  unstake: (stakeId: string) => Promise<void>;
  getDepositAddress: (plan: string) => Promise<string>;
  initiateWithdrawal: (stakeId: string, amount: number, address: string) => Promise<void>;
}

// Mock data for demo purposes
const mockStakes: Stake[] = [
  {
    id: '1',
    plan: 'Core Vault',
    amount: 0.5,
    daily_yield: 1.5,
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 173 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    total_earned: 0.0525,
    last_payout: new Date().toISOString()
  },
  {
    id: '2',
    plan: 'Growth Nexus',
    amount: 2.5,
    daily_yield: 2.5,
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 166 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    total_earned: 0.875,
    last_payout: new Date().toISOString()
  }
];

const useStakingStore = create<StakingState>((set, get) => ({
  stakes: mockStakes,
  loading: false,
  error: null,

  fetchStakes: async () => {
    set({ loading: true });
    try {
      // For demo, we'll use mock data
      set({ stakes: mockStakes, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  getDepositAddress: async (plan: string): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const address = await walletCoreService.generateDepositAddress(user.id, plan);
      if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid deposit address received');
      }

      return address;
    } catch (error) {
      console.error('Error in getDepositAddress:', error);
      throw error;
    }
  },

  createStake: async (plan: string, amount: number, dailyYield: number) => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const depositAddress = await walletCoreService.generateDepositAddress(user.id, plan);
      
      // For demo, immediately create an active stake
      const newStake: Stake = {
        id: Date.now().toString(),
        plan,
        amount,
        daily_yield: dailyYield,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        total_earned: 0,
        last_payout: new Date().toISOString(),
        deposit_address: depositAddress
      };

      set(state => ({
        stakes: [...state.stakes, newStake]
      }));

      return depositAddress;
    } catch (error) {
      console.error('Error creating stake:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  restake: async (stakeId: string) => {
    set({ loading: true });
    try {
      const stake = get().stakes.find(s => s.id === stakeId);
      if (!stake) throw new Error('Stake not found');

      const newAmount = stake.amount + stake.total_earned;
      const newStake: Stake = {
        ...stake,
        id: Date.now().toString(),
        amount: newAmount,
        total_earned: 0,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
      };

      set(state => ({
        stakes: [
          ...state.stakes.filter(s => s.id !== stakeId),
          newStake
        ]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  unstake: async (stakeId: string) => {
    set({ loading: true });
    try {
      set(state => ({
        stakes: state.stakes.map(stake =>
          stake.id === stakeId
            ? { ...stake, status: 'completed' }
            : stake
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  initiateWithdrawal: async (stakeId: string, amount: number, address: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      const txHash = await walletCoreService.initiateWithdrawal(
        user.id,
        amount,
        address
      );

      set(state => ({
        stakes: state.stakes.map(stake =>
          stake.id === stakeId
            ? {
                ...stake,
                status: 'withdrawal_pending',
                amount: stake.amount - amount
              }
            : stake
        )
      }));

      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
      throw error;
    }
  }
}));

export default useStakingStore;
export { useStakingStore };