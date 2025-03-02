import { create } from 'zustand';
import axios from 'axios';



interface Stake {
  id: string;
  user_id: string;
  plan_id: string;
  amount: string;
  earnings: string;
  status: string;
  deposit_address: string;
  lock_period_days: string;
  penalty: string;
  loyalty_bonus: string;
  staked_at: string;
  restake: string;
  unstaked_at: string | null;
  unstaked: string;
  tx_id: string;
  created_at: string;
  due: string;
}

interface StakingState {
  stakes: Stake[] | null;
  loadingStakes: boolean;
  error: string | null;
  fetchStakes: () => Promise<void>;
  // createStake: (plan: string, amount: number, dailyYield: number) => Promise<string>;
  // restake: (stakeId: string) => Promise<void>;
  // unstake: (stakeId: string) => Promise<void>;
  // getDepositAddress: (plan: string) => Promise<string>;
  // initiateWithdrawal: (stakeId: string, amount: number, address: string) => Promise<void>;
}



const useStakingStore = create<StakingState>((set) => ({
  stakes: null,
  loadingStakes: false,
  error: null,

  fetchStakes: async () => {
    set({ loadingStakes: true });
    try {
      const token = localStorage.getItem('auth-token');
      console.log(token);
      if (!token) {
        console.log("No auth token found")
        throw new Error('No auth token found');
      }
      const response = await axios.post("https://stake.betpaddi.com/api/investment/list-stakes.php", {
        token: token
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(response);

      if (response.status !== 200) throw new Error('Failed to fetch user data');
      const data = response.data;
      console.log(data);
      set({ stakes: data['stakes'] });
    } catch (error) {
      console.error('Fetch user data error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ error: error.response.data });
      } else {
        set({ error: String(error) });
      }
    } finally {
      set({ loadingStakes: false });
    }
  },

  // getDepositAddress: async (plan: string): Promise<string> => {
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) throw new Error('User not authenticated');

  //     const address = await walletCoreService.generateDepositAddress(user.id, plan);
  //     if (!address || !ethers.isAddress(address)) {
  //       throw new Error('Invalid deposit address received');
  //     }

  //     return address;
  //   } catch (error) {
  //     console.error('Error in getDepositAddress:', error);
  //     throw error;
  //   }
  // },

  // createStake: async (plan: string, amount: number, dailyYield: number) => {
  //   set({ loadingStakes: true });
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) throw new Error('User not authenticated');

  //     const depositAddress = await walletCoreService.generateDepositAddress(user.id, plan);

  //     // For demo, immediately create an active stake
  //     const newStake: Stake = {
  //       id: Date.now().toString(),
  //       plan,
  //       amount,
  //       daily_yield: dailyYield,
  //       status: 'active',
  //       start_date: new Date().toISOString(),
  //       end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  //       total_earned: 0,
  //       last_payout: new Date().toISOString(),
  //       deposit_address: depositAddress
  //     };

  //     set(state => ({
  //       stakes: [...state.stakes, newStake]
  //     }));

  //     return depositAddress;
  //   } catch (error) {
  //     console.error('Error creating stake:', error);
  //     throw error;
  //   } finally {
  //     set({ loadingStakes: false });
  //   }
  // },

  // restake: async (stakeId: string) => {
  //   set({ loadingStakes: true });
  //   try {
  //     const stake = get().stakes.find(s => s.id === stakeId);
  //     if (!stake) throw new Error('Stake not found');

  //     const newAmount = stake.amount + stake.total_earned;
  //     const newStake: Stake = {
  //       ...stake,
  //       id: Date.now().toString(),
  //       amount: newAmount,
  //       total_earned: 0,
  //       start_date: new Date().toISOString(),
  //       end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
  //     };

  //     set(state => ({
  //       stakes: [
  //         ...state.stakes.filter(s => s.id !== stakeId),
  //         newStake
  //       ]
  //     }));
  //   } catch (error) {
  //     set({ error: (error as Error).message });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  // unstake: async (stakeId: string) => {
  //   set({ loading: true });
  //   try {
  //     set(state => ({
  //       stakes: state.stakes.map(stake =>
  //         stake.id === stakeId
  //           ? { ...stake, status: 'completed' }
  //           : stake
  //       )
  //     }));
  //   } catch (error) {
  //     set({ error: (error as Error).message });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  // initiateWithdrawal: async (stakeId: string, amount: number, address: string): Promise<void> => {
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) throw new Error('User not authenticated');

  //     if (!ethers.isAddress(address)) {
  //       throw new Error('Invalid Ethereum address');
  //     }

  //     const txHash = await walletCoreService.initiateWithdrawal(
  //       user.id,
  //       amount,
  //       address
  //     );

  //     set(state => ({
  //       stakes: state.stakes.map(stake =>
  //         stake.id === stakeId
  //           ? {
  //             ...stake,
  //             status: 'withdrawal_pending',
  //             amount: stake.amount - amount
  //           }
  //           : stake
  //       )
  //     }));

  //     console.log('Transaction Hash:', txHash);
  //   } catch (error) {
  //     console.error('Error initiating withdrawal:', error);
  //     throw error;
  //   }
  // }
}));

export default useStakingStore;
export { useStakingStore };

