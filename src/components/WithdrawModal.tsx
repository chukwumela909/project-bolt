import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Wallet } from 'lucide-react';
import { useReferralStore } from '../store/referralStore';
import { useEffect } from 'react';

interface WithdrawModalProps {
  isOpen: boolean;
  balance: number;
  onClose: () => void;
  ethPrice: number;
}

export function WithdrawModal({ isOpen, balance, onClose, ethPrice }: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    withdraw, withdrawerror,
  } = useReferralStore();

  useEffect(() => {
    if (withdrawerror) {
      setError(withdrawerror);
      setAmount('');
      setAddress('');
    }
  }, [withdrawerror]);

  

  const maxAmount = balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (Number(amount) > maxAmount) {
      setError('Amount exceeds available balance');
      return;
    }

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      setIsLoading(true);
      await withdraw(amount.toString(), address);
      if (withdrawerror) {
        setTimeout(() => {
          setError(withdrawerror);
          setAmount('');
          setAddress('');
        }, 2000);
      }
      // onClose();
    } catch (err) {
      console.log("the" + err)
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setError('');
              onClose();
              }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg shadow-xl"
          >
            <div className="absolute top-4 right-4">
              <button
                 onClick={() => {
                  setError('');
                  onClose();
                  }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 text-blue-400 mb-6">
              <Wallet className="w-8 h-8" />
              <h3 className="text-xl font-bold">Withdraw Funds</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Available Balance</label>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-lg font-bold">{maxAmount.toFixed(4)} ETH</div>
                  <div className="text-sm text-slate-400">≈ ${(maxAmount * ethPrice).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-2">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.0001"
                    min="0"
                    max={maxAmount}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">ETH</span>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Withdrawal Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0x..."
                />
              </div>

              {error &&  (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                  setError('');
                  onClose();
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Withdraw'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}