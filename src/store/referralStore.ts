import { create } from 'zustand';
import axios from 'axios';


interface ReferralState {
  loadingWithdraw: boolean;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  referralRewards: number;
  withdrawerror: string | null;
  // fetchReferralStats: () => Promise<void>;
  // generateReferralCode: () => Promise<void>;
  withdraw: (amount: string, eth_address: string) => Promise<void>;
}

export const useReferralStore = create<ReferralState>((set) => ({
  referralCode: 'DEMO123',
  totalReferrals: 5,
  activeReferrals: 3,
  referralRewards: 0.25,
  loadingWithdraw: false,
  withdrawerror: null,

  // fetchReferralStats: async () => {
  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //     set({
  //       totalReferrals: 0,
  //       activeReferrals: 0,
  //       referralRewards: 0,
  //       loading: false,
  //       error: null
  //     });
  //     return;
  //   }

  //   // For demo, use static data
  //   set({
  //     totalReferrals: 5,
  //     activeReferrals: 3,
  //     referralRewards: 0.25,
  //     loading: false,
  //     error: null
  //   });
  // },

  // generateReferralCode: async () => {
  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //     set({
  //       referralCode: '',
  //       error: null
  //     });
  //     return;
  //   }

  //   // For demo, use static code
  //   set({
  //     referralCode: 'DEMO123',
  //     error: null
  //   });
  // },

  withdraw: async (amount: string, eth_address: string): Promise<void> => {
    set({ loadingWithdraw: true });
    try {
      const token = localStorage.getItem('auth-token');
      console.log(token);
      if (!token) {
        console.log("No auth token found")
        throw new Error('No auth token found');
      }
      const response = await axios.post("https://app.starkord.com/api/withdrawal/create.php", {
        token: token,
        amount: amount,
        eth_address: eth_address,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer a7bX9c2dE5fg1h8i"
        },
      });

      console.log(response);

      if (response.status !== 200) throw new Error('Failed to withdraw');
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error('withdraw error:', error);
      if (axios.isAxiosError(error) && error.response) {
        set({ withdrawerror: error.response.data.message });
      } else {
        set({ withdrawerror: String(error) });
        throw error;
      }
    } finally {
      set({ loadingWithdraw: false });
      return
    }
  },
}
)
);