import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, Wallet, CheckCircle2 } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAddress: string;
  minAmount: number;
  ethPrice: number;
}

export function DepositModal({ isOpen, onClose, depositAddress, minAmount, ethPrice }: DepositModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

            <div className="flex items-center space-x-4 text-blue-400 mb-6">
              <Wallet className="w-8 h-8" />
              <h3 className="text-xl font-bold">Deposit ETH</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Deposit</label>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-lg font-bold">{minAmount} ETH</div>
                  <div className="text-sm text-slate-400">≈ ${(minAmount * ethPrice).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deposit Address</label>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 break-all font-mono">
                  {depositAddress}
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <div className="text-sm text-slate-400">
                <p>• Send only ETH to this address</p>
                <p>• Minimum deposit amount: {minAmount} ETH</p>
                <p>• Deposits will be credited after network confirmation</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}