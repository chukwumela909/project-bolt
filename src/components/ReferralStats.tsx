import  { useState } from 'react';
import { Users, Award, TrendingUp, CheckCircle2, Copy, AlertCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReferralStatsProps {
  referralCode: string;
  handleWithdraw: () => void;
  totalReferrals: number;
  activeReferrals: number;
  referralRewards: number;
  ethPrice: number;
}

export function ReferralStats({ referralCode, totalReferrals, handleWithdraw, activeReferrals, referralRewards, ethPrice }: ReferralStatsProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = () => {
    console.log('Copying referral link:', referralLink);
    setError(null);
    
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      setError('Failed to copy link');
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Referral Program</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="bg-slate-800/50 px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-slate-400">Your Code:</span>
            <span className="font-mono font-bold">{referralCode}</span>
          </div>
          {/* <button
            onClick={copyToClipboard}
            className={`px-4 py-2 ${
              copied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg flex items-center space-x-2 text-sm transition-colors w-full sm:w-auto justify-center`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Referral Link</span>
              </>
            )}
          </button> */}
          <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyToClipboard()}
              className=" mt-2 bg-blue-500 hover:bg-yellow-600 backdrop-blur-sm px-4 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Referral Link</span>
              </>
            )}
            </motion.button> 
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Referrals</p>
              <p className="text-2xl font-bold mt-2">{totalReferrals}</p>
              <p className="text-sm text-purple-400">All-time invites</p>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Referrals</p>
              <p className="text-2xl font-bold mt-2">{activeReferrals}</p>
              <p className="text-sm text-green-400">Currently staking</p>
            </div>
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Award className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400"> Total Referral Rewards</p>
              <p className="text-2xl font-bold mt-2 text-blue-400">{referralRewards.toFixed(4)} ETH</p>
              <p className="text-sm text-blue-500">≈ ${(referralRewards * ethPrice).toLocaleString()}</p>
            </div>
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
           
          </div>
          <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWithdraw()}
              className="w-full mt-2 bg-green-500 hover:bg-yellow-600 backdrop-blur-sm px-4 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Withdraw
            </motion.button> 
        </div>
        
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold mb-4">Your Referrals</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-700/50">
                <th className="pb-3 px-4">User</th>
                <th className="pb-3 px-4">Joined</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Total Staked</th>
                <th className="pb-3 px-4">Your Rewards</th>
              </tr>
            </thead>
            <tbody>
              {/* This will be populated with actual referral data */}
              <tr className="text-slate-400 text-sm">
                <td className="py-4 px-4" colSpan={5}>
                  No referrals yet. Share your referral link to start earning rewards!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}