
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface UnstakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stake: {
    amount: number;
    total_earned: number;
    end_date: string;
  };
  ethPrice: number;
}

export function UnstakeModal({ isOpen, onClose, onConfirm, stake, ethPrice }: UnstakeModalProps) {
  const daysRemaining = Math.ceil(
    (new Date(stake.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const penaltyPercentage = 10; // 10% penalty for early withdrawal
  const penaltyAmount = stake.amount * (penaltyPercentage / 100);
  const finalAmount = stake.amount - penaltyAmount + stake.total_earned;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                    <div className="font-bold">{stake.amount.toFixed(4)} ETH</div>
                    <div className="text-sm text-slate-400">
                      ≈ ${(stake.amount * ethPrice).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-green-400">
                  <span>Earned Rewards</span>
                  <div className="text-right">
                    <div className="font-bold">+{stake.total_earned.toFixed(4)} ETH</div>
                    <div className="text-sm opacity-80">
                      ≈ +${(stake.total_earned * ethPrice).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-amber-400">
                  <span>Early Withdrawal Penalty ({penaltyPercentage}%)</span>
                  <div className="text-right">
                    <div className="font-bold">-{penaltyAmount.toFixed(4)} ETH</div>
                    <div className="text-sm opacity-80">
                      ≈ -${(penaltyAmount * ethPrice).toLocaleString()}
                    </div>
                  </div>
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
              </div>

              <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-4">
                <p className="text-sm text-amber-400">
                  <strong>Note:</strong> By unstaking early, you'll incur a {penaltyPercentage}% penalty on your original stake. Consider restaking instead to maintain your earning potential.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Confirm Unstake
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}