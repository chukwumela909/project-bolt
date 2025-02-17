import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ReferralState {
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  referralRewards: number;
  loading: boolean;
  error: string | null;
  fetchReferralStats: () => Promise<void>;
  generateReferralCode: () => Promise<void>;
}

export const useReferralStore = create<ReferralState>((set) => ({
  referralCode: 'DEMO123',
  totalReferrals: 5,
  activeReferrals: 3,
  referralRewards: 0.25,
  loading: false,
  error: null,

  fetchReferralStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({
        totalReferrals: 0,
        activeReferrals: 0,
        referralRewards: 0,
        loading: false,
        error: null
      });
      return;
    }

    // For demo, use static data
    set({
      totalReferrals: 5,
      activeReferrals: 3,
      referralRewards: 0.25,
      loading: false,
      error: null
    });
  },

  generateReferralCode: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({
        referralCode: '',
        error: null
      });
      return;
    }

    // For demo, use static code
    set({ 
      referralCode: 'DEMO123', 
      error: null 
    });
  },
}));