import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, country: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  signIn: async (email, password) => {
    try {
  
      // Encode the target URL
      // const targetUrl = encodeURIComponent('https://stake.betpaddi.com/api/auth/login.php');
      // const proxyUrl = `https://api.allorigins.win/raw?url=${targetUrl}`;
  
      const response = await axios.post("https://stake.betpaddi.com/api/auth/login.php", {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

  
      if (response.status == 401) throw new Error('Sign in failed');
      const data = response.data;
      console.log(data);
      set({ user: data.user });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (email, password, name, country, phone) => {

    try {

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Accept", "application/json");
      
      const targetUrl = encodeURIComponent('https://stake.betpaddi.com/api/auth/register.php');
      const proxyUrl = `https://api.allorigins.win/raw?url=${targetUrl}`;
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          email: "test@example.com",
          password: "securepassword",
          name: "secure password",
          country: "Nigeria",
          phone: "0393445"
        }),
      });

      console.log(email, password, name, country, phone);
      

      if (!response.ok) {
        throw new Error('Sign up failed');
      }


      const data = await response.json();
      console.log(data);
      set({ user: data.user });
    } catch (error) {
      if (error instanceof TypeError) {
        console.error('Network error or invalid URL:', error);
      } else {
        console.error('Sign up error:', error);
      }
      throw error;
    }
  },

  clearSession: () => {
    localStorage.removeItem('auth-token');
    set({ user: null, loading: false });
  },

  signOut: async () => {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Sign out failed');
      }

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Reset the store state
      set({ user: null, loading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear the local state
      localStorage.clear();
      sessionStorage.clear();
      set({ user: null, loading: false });
      throw error;
    }
  },
}));