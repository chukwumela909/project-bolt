
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStakingStore from '../store/stakingStore';


interface UnstakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stake: {
    id: string;
    amount: string;
    earnings: string;
    lock_period_days: string;
    staked_at: string;
    penalty: string;
  };
  ethPrice: number;
}

export function UnstakeModal({ isOpen, onClose, stake, ethPrice }: UnstakeModalProps) {
  const navigate = useNavigate();

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(stake.staked_at).getTime() + Number(stake.lock_period_days) * 24 * 60 * 60 * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  )


  

  const penaltyPercentage = Number(stake.penalty); // 10% penalty for early withdrawal
  const feePercentage = 5; // 10% penalty for early withdrawal
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [walletAddress, setwalletAddress] = useState('');
  const [error, setError] = useState('');

  const {unstake, loadingUnstake} = useStakingStore();


  

  const handleUnstakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnstakeAmount(Number(e.target.value));
  };
  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setwalletAddress(e.target.value);
  };

  const penaltyAmount = unstakeAmount * (penaltyPercentage / 100);
  const feeAmount = unstakeAmount * (feePercentage / 100);
  const finalAmount = unstakeAmount - penaltyAmount - feeAmount;

    const handleUnstakeConfirm = async (id: string, walletAddress: string, unstakeAmount:string) => {
    
      try {
        if (Number(unstakeAmount) <= 0) {
          setError('Please enter a valid unstake amount.');
          return;
        }

        const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!walletAddressRegex.test(walletAddress)) {
          setError('Please enter a valid Ethereum wallet address.');
          return;
        }
       unstake(id, walletAddress, unstakeAmount.toString());
        // await fetchStakes();
        navigate('/dashboard')
      } catch (error) {
        console.error('Unstake error:', error);
      } finally {
      }
   
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <><div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg shadow-xl"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 text-amber-400 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Unstake Warning</h3>
            </div>

            <div className="space-y-4">
              <p className="text-slate-300">
                You still have <span className="text-amber-400 font-bold">{daysRemaining} days</span> remaining in your staking period.
                Early unstaking will result in a penalty.
              </p>

              <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Original Stake</span>
                  <div className="text-right">
                    <div className="font-bold">{Number(stake.amount).toFixed(4)} ETH</div>
                    <div className="text-sm text-slate-400">
                      ≈ ${(Number(stake.amount) * ethPrice).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-green-400">
                  <span>Earned Rewards</span>
                  <div className="text-right">
                    <div className="font-bold">+{Number(stake.earnings).toFixed(4)} ETH</div>
                    <div className="text-sm opacity-80"></div>
                    ≈ +${(Number(stake.earnings) * ethPrice).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-amber-400">
                <span>Early Withdrawal Penalty ({penaltyPercentage}%)</span>
              </div>
              <div className="flex justify-between items-center text-amber-400">
                <span>Unstaking fee ({feePercentage}%)</span>
              </div>

              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">You will receive</span>
                  <div className="text-right">
                    <div className="font-bold text-lg">{finalAmount.toFixed(4)} ETH</div>
                    <div className="text-sm text-slate-400">
                      ≈ ${(finalAmount * ethPrice).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-4">
                <p className="text-sm text-amber-400">
                  <strong>Note:</strong> By unstaking early, you'll incur a {penaltyPercentage}% penalty on your original stake. Consider restaking instead to maintain your earning potential.
                </p>
              </div>
              <div className="space-y-4">
                <label className="block text-slate-400">Amount to Unstake (ETH)</label>
                <input
                  type="text"
                  value={unstakeAmount}
                  onChange={handleUnstakeAmountChange}
                  className="w-full p-2 bg-slate-700 text-white rounded-lg" />
                <label className="block text-slate-400">Wallet Address (ETH)</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={handleWalletAddressChange}
                  className="w-full p-2 bg-slate-700 text-white rounded-lg" />
              </div>
              {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                {loadingUnstake ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg transition-colors"
                    disabled
                  >
                    Loading...
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUnstakeConfirm(stake.id, walletAddress, unstakeAmount.toString())}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Confirm Unstake
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  );
}


