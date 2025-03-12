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
  bonus_note: string;
  unstaked_at: string | null;
  unstaked: string;
  tx_id: string;
  created_at: string;
  due: string;
}

interface StakingState {
  stakes: Stake[] | null;
  loadingStakes: boolean;
  loadingAddress: boolean;
  loadingUnstake: boolean;
  loadingRestake: boolean;
  deposit_address: string | null;
  error: string | null;
  unstakeError: string | null
  restakeError: string | null
  depositError: string | null
  fetchStakes: () => Promise<void>;
  getDepositAddress: (plan: string) => Promise<boolean>;
  restake: (stakeId: string) => Promise<boolean>;
  unstake: (stake_id: string, wallet_address: string, unstake_amount: string) => Promise<boolean>;

  // createStake: (plan: string, amount: number, dailyYield: number) => Promise<string>;
  // restake: (stakeId: string) => Promise<void>;
  // unstake: (stakeId: string) => Promise<void>;
  // initiateWithdrawal: (stakeId: string, amount: number, address: string) => Promise<void>;
}



const useStakingStore = create<StakingState>((set) => ({
  stakes: null,
  loadingStakes: false,
  loadingAddress: false,
  loadingUnstake: false,
  loadingRestake: false,
  deposit_address: null,
  error: null,
  unstakeError: null,
  restakeError: null,
  depositError: null,

  fetchStakes: async () => {
    set({ loadingStakes: true });
    try {
      const token = localStorage.getItem('auth-token');
      console.log(token);
      if (!token) {
        console.log("No auth token found")
        throw new Error('No auth token found');
      }
      const response = await axios.post("https://app.starkord.com/api/investment/list-stakes.php", {
        token: token
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer a7bX9c2dE5fg1h8i"
        },
      });

      console.log(response);

      if (response.status !== 200) throw new Error('Failed to fetch user data');
      const data = response.data;
      console.log(data);
      set({ stakes: data['stakes'] });
    } catch (error) {
      console.error('Fetch stakes error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ error: error.response.data });
      } else {
        set({ error: String(error) });
      }
    } finally {
      set({ loadingStakes: false });
    }
  },

  getDepositAddress: async (plan: string): Promise<boolean> => {
    set({ loadingAddress: true,  depositError: null});
    try {
      const token = localStorage.getItem('auth-token');

      if (!token) {
        set({ depositError: "No auth token found" })
        return false
      }

      const response = await axios.post("https://app.starkord.com/api/investment/stake.php", {
        token: token,
        plan_id: plan
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer a7bX9c2dE5fg1h8i"
        },
      });


      if (response.status !== 200) {
        set({depositError : 'Failed to generate deposit address'})
        return false;
      }

      const data = response.data;
      set({ deposit_address: data['deposit_address'] });
      return true

      
    } catch (error) {
      console.error('Generate address:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ depositError: error.response.data.message || "Failed generate" });
      } else {
        set({ depositError: String(error) });
        throw error;
      }
      return false
    } finally {
      set({ loadingAddress: false });
      // return false;
    }
  },

  unstake: async (stake_id: string, wallet_address: string, unstake_amount: string): Promise<boolean> => {
    set({ loadingUnstake: true, unstakeError: null });
    try {
      const token = localStorage.getItem('auth-token');

      if (!token) {
        set({ restakeError: "No auth token found" })
        return false;
      }
      const response = await axios.post("https://app.starkord.com/api/investment/unstake.php", {
        token: token,
        stake_id: stake_id,
        wallet_address: wallet_address,
        unstake_amount: unstake_amount
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer a7bX9c2dE5fg1h8i"
        },
      });


      if (response.status !== 200) throw new Error('Failed to restake');

      return true;

    } catch (error) {
      console.error('unstake error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ unstakeError: error.response.data.message || "Failed to unstake" });
      } else {
        set({ unstakeError: String(error) });
        throw error;
      }
      return false
    } finally {
      set({ loadingUnstake: false });
    }
  },



  restake: async (stakeId: string): Promise<boolean> => {
    set({ loadingRestake: true, restakeError: null });
    try {
      const token = localStorage.getItem('auth-token');

      if (!token) {
        set({ restakeError: "No auth token found" })
        return false;
      }

      const response = await axios.post("https://app.starkord.com/api/investment/restake.php", {
        token: token,
        stake_id: stakeId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer a7bX9c2dE5fg1h8i"
        },
      });


      if (response.status !== 200) throw new Error('Failed to restake');

      return true;

    } catch (error) {
      console.error('Restake error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ restakeError: error.response.data.message || "Failed to restake" });
      } else {
        set({ restakeError: String(error) });
        throw error;
      }
      return false
    } finally {
      set({ loadingRestake: false });

    }
  },

}));

export default useStakingStore;
export { useStakingStore };

