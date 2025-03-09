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
  loadingAddress: boolean;
  loadingUnstake: boolean;
  loadingRestake: boolean;
  deposit_address: string | null;
  error: string | null;
  unstakeError: string | null
  restakeError: string | null
  fetchStakes: () => Promise<void>;
  getDepositAddress: (plan: string) => Promise<void>;
  restake: (stakeId: string) => Promise<boolean>;
  unstake: (stake_id: string, wallet_address: string, unstake_amount: string) => Promise<void>;

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

  getDepositAddress: async (plan: string): Promise<void> => {
    set({ loadingAddress: true });
    try {
      const token = localStorage.getItem('auth-token');
      console.log(token);
      if (!token) {
        console.log("No auth token found")
        throw new Error('No auth token found');
      }
      const response = await axios.post("https://stake.betpaddi.com/api/investment/stake.php", {
        token: token,
        plan_id: plan
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(response);

      if (response.status !== 200) throw new Error('Failed to generate deposit address');
      const data = response.data;
      console.log(data);
      set({ deposit_address: data['deposit_address'] });
    } catch (error) {
      console.error('Fetch stakes error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ error: error.response.data });
      } else {
        set({ error: String(error) });
        throw error;
      }
    } finally {
      set({ loadingAddress: false });
      // return false;
    }
  },

  unstake: async (stake_id: string, wallet_address: string, unstake_amount: string): Promise<void> => {
    set({ loadingUnstake: true });
    try {
      const token = localStorage.getItem('auth-token');
      console.log(token);
      if (!token) {
        console.log("No auth token found")
        throw new Error('No auth token found');
      }
      const response = await axios.post("https://stake.betpaddi.com/api/investment/unstake.php", {
        token: token,
        stake_id: stake_id,
        wallet_address: wallet_address,
        unstake_amount: unstake_amount
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(response);
      console.log({
        token: token,
        stake_id: stake_id,
        wallet_address: wallet_address,
      })



      if (response.status !== 200) throw new Error('Failed to unstake');
      const data = response.data;
      console.log(data.message);
      // if (true) {
      //   const alertMessage = document.createElement('div');
      //   alertMessage.textContent = response.data.message;
      //   alertMessage.style.position = 'fixed';
      //   alertMessage.style.top = '50%';
      //   alertMessage.style.left = '50%';
      //   alertMessage.style.transform = 'translate(-50%, -50%)';
      //   alertMessage.style.backgroundColor = 'green';
      //   alertMessage.style.color = 'white';
      //   alertMessage.style.padding = '10px';
      //   alertMessage.style.borderRadius = '5px';
      //   document.body.appendChild(alertMessage);

      //   setTimeout(() => {
      //     document.body.removeChild(alertMessage);
      //   }, 3000);
      // }
    } catch (error) {
      console.error('unstake error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ unstakeError: error.response.data.error });
      } else {
        set({ unstakeError: String(error) });
        throw error;
      }
    } finally {
      set({ loadingUnstake: false });
      return
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

      const response = await axios.post("https://stake.betpaddi.com/api/investment/restake.php", {
        token: token,
        stake_id: stakeId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });


      if (response.status !== 200) throw new Error('Failed to unstake');


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

