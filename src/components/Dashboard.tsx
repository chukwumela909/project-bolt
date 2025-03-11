import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useStakingStore } from '../store/stakingStore';
import { UnstakeModal } from './UnstakeModal';
import { DepositModal } from './DepositModal';
import { RestakeModal } from './RestakeModal';
import { ReferralStats } from './ReferralStats';
import {
  LineChart,
  Wallet,
  ArrowUpRight,
  Clock,
  DollarSign,
  RefreshCw,
  LogOut,
  TrendingUp,
  Calendar,
  AlertCircle,
  User,
  Home,

} from 'lucide-react';
import { WithdrawModal } from './WithdrawModal';


const planNotes: { [key: string]: string } = {
  "045a88bc-e647-11ef-8679-04421a23dd01": "Note: If no withdrawals are made for 60 days, you will receive a bonus yield increase of 0.05% per month (max yield 1.5%)",
  "045a8a8b-e647-11ef-8679-04421a23dd01": "Note: If no withdrawals are made for 60 days, you will receive a bonus yield increase of 0.05% per month (max yield 2.5%)",
  "045a8b03-e647-11ef-8679-04421a23dd01": "Note: If no withdrawals are made for 60 days, you will receive a bonus yield increase of 0.05% per month (max yield 3.5%)",
  "174e640d-e6e1-11ef-8679-04421a23dd01": "Note: If no withdrawals are made for 60 days, you will receive a bonus yield increase of 0.05% per month (max yield 3.5%)"
};



const componentMap = {
  Wallet: Wallet,
  LineChart: LineChart,
  Clock: Clock,
  DollarSign: DollarSign
};

const PlanIcon = ({ iconName }: { iconName: string }) => {
  // Get the component from the mapping
  const IconComponent = componentMap[iconName as keyof typeof componentMap];

  if (!IconComponent) {
    // Handle the case where the iconName is not found in the mapping
    return <div>Icon not found</div>;
  }

  // Render the component
  return <IconComponent className="w-10 h-10 mb-4" />;
};

const activeStakesPlanMatch = {
  "045a88bc-e647-11ef-8679-04421a23dd01": "Core Vault",
  "045a8a8b-e647-11ef-8679-04421a23dd01": "Growth Nexus",
  "045a8b03-e647-11ef-8679-04421a23dd01": "Elite Matrix",
  "174e640d-e6e1-11ef-8679-04421a23dd01": "Legacy Protocol",
}



function Dashboard() {
  const navigate = useNavigate();
  const { clearSession } = useAuthStore();
  const { fetchUserData, getInvestmentPlans, plans, loading, user } = useUserStore();

  const {
    stakes,
    loadingStakes,
    loadingAddress,
    fetchStakes,
    loadingRestake,
    getDepositAddress,
    depositError,
    deposit_address,
  } = useStakingStore();


  // const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [ethPriceLoading, setEthPriceLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  // const [selectedStake, setSelectedStake] = useState<string | null>(null);
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false);
  const [restakeModalOpen, setRestakeModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawrefModalOpen, setWithdrawrefModalOpen] = useState(false);
  const [selectedUnstake, setSelectedUnstake] = useState<any>(null);
  const [selectedRestake, setSelectedRestake] = useState<any>(null);
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [ethPriceError, setEthPriceError] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);



  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await clearSession();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    getInvestmentPlans();
    fetchStakes();
    fetchEthPrice();



    const updateInterval = setInterval(() => {
      fetchUserData();
      getInvestmentPlans();
      fetchStakes();
      fetchEthPrice();
      setLastUpdate(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(updateInterval);



  }, [deposit_address, depositAddress]);

  const fetchEthPrice = async () => {
    try {
      setEthPriceLoading(true);
      setEthPriceError(false);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        {
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.ethereum?.usd) {
        setEthPrice(data.ethereum.usd);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      setEthPriceError(true);
      setEthPrice(1800);
    } finally {
      setEthPriceLoading(false);
    }
  };

  const handleStake = async (plan: string, planId: string, minStake: number) => {
    try {
      setSelectedPlan({ name: plan, minStake });
      console.log(`Selected plan: ${plan}, ${planId}, ${minStake}`);
     await getDepositAddress(planId);

      if (deposit_address) {
        setDepositAddress(deposit_address);
      }

      setDepositModalOpen(true);
    } catch (error) {
      console.error('Error handling stake:', error);
    } finally {
    }
  };

  function calculateRemainingDaysCustomFormat(
    stakedDate: string,
    lockPeriodDays: number,
    currentDate: string = new Date().toISOString().split('T')[0]
  ): number {
    const stakedDateParts = stakedDate.split(' '); // Split date and time
    const stakedDateOnly = stakedDateParts[0]; // Get the date part
    const stakedDateTime = new Date(stakedDateOnly);
    const currentDateTime = new Date(currentDate);
  
    const lockPeriodEndDate = new Date(stakedDateTime);
    lockPeriodEndDate.setDate(stakedDateTime.getDate() + lockPeriodDays);
  
    const timeDifference = lockPeriodEndDate.getTime() - currentDateTime.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
    return daysRemaining;
  }



  const handleUnstakeClick = (stake: any) => {
    setSelectedUnstake(stake);
    setUnstakeModalOpen(true);
  };

  const handleRestakeClick = (stakeid: any) => {
    setSelectedRestake(stakeid);
    setRestakeModalOpen(true);
  };

  const handleWithdrawRefClick = () => {
    // setSelectedUnstake(stake);
    console.log("withdraw ref clicked")
    setWithdrawrefModalOpen(true);
  };

  //  const handleUnstakeConfirm = async (id: string, walletAddress: string, unstakeAmount:string) => {
  //   if (selectedUnstake) {
  //     try {
  //      unstake(id, walletAddress, unstakeAmount.toString());
  //       // await fetchStakes();
  //       setUnstakeModalOpen(false);
  //       setSelectedUnstake(null);
  //     } catch (error) {
  //       console.error('Unstake error:', error);
  //     } finally {
  //       setActionLoading(null);
  //     }
  //   }
  // };



  const activeStakes = stakes ? stakes.filter(stake => stake.status === 'staked') : [];
  // const totalStaked = stakes.reduce((acc, stake) => acc + stake.amount, 0);
  // const totalRewards = stakes.reduce((acc, stake) => acc + stake.total_earned, 0);
  // const dailyRewards = activeStakes.reduce((acc, stake) => acc + (stake.amount * stake.daily_yield / 100), 0);

  const username = user?.name;

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <p className="text-xl font-semibold text-slate-400">Loading</p>
      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
    </div>;
  }

  if (loadingStakes) {
    return <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <p className="text-xl font-semibold text-slate-400">Loading stakes</p>
      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
    </div>;
  }

  if (loadingAddress) {
    return <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <p className="text-xl font-semibold text-slate-400">Generating address</p>
      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
    </div>;
  }

  if (!user) {
    return <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <p className="text-xl font-semibold text-slate-400">Oops, Session Expired.</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/login')}
        className=" bg-slate-700 mb-2 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg  transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Go to login
      </motion.button>
    </div>;

  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Staking Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">Welcome back, {loading ? "..." : username} </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className=" hidden md:flex items-center space-x-2 text-sm text-slate-400">
              <RefreshCw className="w-4 h-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="w-full bg-slate-700 mb-2 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg  transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/profile')}
                className="w-full bg-slate-700 mb-2 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg  transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4 mr-2" />

                Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 backdrop-blur-sm px-4 py-2 rounded-lg  transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </motion.button>

            </div>

          </div>
        </div>


        {ethPriceLoading && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
            <p className="text-sm text-blue-500">
              Fetching current ETH price...
            </p>
          </div>
        )}

        {ethPriceError && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-yellow-500">
              Unable to fetch current ETH price. Using estimated values.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Staked</p>
                <p className="text-2xl font-bold">{user.total_staked.toFixed(4)} ETH</p>
                <p className="text-sm text-slate-400">≈ ${(user.total_staked * ethPrice).toLocaleString()}</p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Rewards</p>
                <p className="text-2xl font-bold text-green-400">{user.total_rewards.toFixed(4)} ETH</p>
                <p className="text-sm text-green-500">≈ ${(user.total_rewards * ethPrice).toLocaleString()}</p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Stakes</p>
                <p className="text-2xl font-bold">{activeStakes.length}</p>
                <p className="text-sm text-slate-400">Active positions</p>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Daily Rewards</p>
                <p className="text-2xl font-bold text-blue-400">{user.daily_rewards.toFixed(4)} ETH</p>
                <p className="text-sm text-blue-500">≈ ${(user.daily_rewards * ethPrice).toLocaleString()}</p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          {/* <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Referral earnings</p>
                <p className="text-2xl font-bold text-blue-400">{Number(user.earnings).toFixed(4)} ETH</p>
                <p className="text-sm text-blue-500">≈ ${(Number(user.earnings) * ethPrice).toLocaleString()}</p>

              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Wallet2 className="w-6 h-6 text-green-400" />

              </div>

            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWithdrawRefClick()}
              className="w-full mt-2 bg-green-500 hover:bg-yellow-600 backdrop-blur-sm px-4 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Withdraw
            </motion.button>            
          </div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Active Stakes</h2>
            <div className="text-sm text-slate-400">
              {activeStakes.length} active {activeStakes.length === 1 ? 'position' : 'positions'}
            </div>
          </div>

          {activeStakes.length > 0 ? (
            <div className="grid gap-4">
              {activeStakes.map(stake => {
                const daysRemaining = calculateRemainingDaysCustomFormat(stake.staked_at, Number(stake.lock_period_days));
                const bonus_daysRemaining = 60 - (Number(stake.lock_period_days) - daysRemaining);

                return (
                  <motion.div
                    key={stake.id}
                    layoutId={stake.id}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{activeStakesPlanMatch[stake.plan_id as keyof typeof activeStakesPlanMatch]}</h3>
                          <p className="text-sm text-slate-400">Started {new Date(stake.created_at).toLocaleDateString()}</p>
                        </div>

                        <div className="flex space-x-2">
                        <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRestakeClick(stake.id)}
                              disabled={loadingRestake == true ? true : false}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2 text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Restake</span>
                            </motion.button>


                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUnstakeClick(stake)}
                            // disabled={actionLoading === stake.id + '_unstake'}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2 text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Unstake</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Staked Amount</p>
                          <p>  {Number(stake.amount).toFixed(4)}ETH</p>
                          <p className="text-sm text-slate-400">≈ ${(Number(stake.amount) * ethPrice).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Daily Yield</p>
                          <p> {((Number(stake.earnings) / Number(stake.amount)) / Number(stake.lock_period_days) * 100).toFixed(2)}%</p>
                          <p className="text-sm text-green-500">{(Number(stake.amount) * Number(stake.earnings) / 100).toFixed(4)} ETH/day</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Total Rewards</p>
                          <p className="text-lg font-bold text-blue-400">{Number(stake.earnings).toFixed(4)} ETH</p>
                          <p className="text-sm text-blue-500">≈ ${(Number(stake.earnings) * ethPrice).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Reward Cycle / Bonus Yeild</p>
                          <p className="text-md font-bold">{daysRemaining < 0 ? 0 : daysRemaining} days Remaining / {bonus_daysRemaining < 0 ? 0 : bonus_daysRemaining} days Remaining </p>
                          <p className='text-sm text-gray-300'>{planNotes[stake.plan_id as keyof typeof planNotes]}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50 text-center"
            >
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">No Active Stakes</p>
              <p className="text-slate-400">Start staking to earn rewards and track your progress here!</p>
            </motion.div>
          )}
        </motion.div>

        {/* <button onClick={() => {console.log("hello world")}} className='p-4 bg-slate-500'>just testing</button> */}

        <ReferralStats
          referralCode={user.referral_code}
          totalReferrals={Number(user.total_referrals)}
          handleWithdraw={handleWithdrawRefClick}
          activeReferrals={Number(user.active_referrals)}
          referralRewards={user.referral_rewards}
          ethPrice={ethPrice}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {plans?.map(plan => {
              // const isGeneratingAddress = actionLoading === `generating_address_${plan.name}`;

              return (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-b ${plan.color} rounded-xl p-6 relative overflow-hidden glow-effect`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />

                  <PlanIcon iconName={plan.icon} />
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

                  <p className="text-sm text-white/80 mb-4">{plan.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Min Stake</span>
                      <span className="font-bold">{plan.min_amount} ETH</span>
                    </div>
                    <div className="text-sm text-white/80 text-right">
                      ≈ ${(Number(plan.min_amount) * ethPrice).toLocaleString()}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Daily Yields</span>
                      <span className="font-bold">{plan.dpy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Reward Cycle</span>
                      <span className="font-bold">{plan.lock_period_days} days</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      await handleStake(plan.name, plan.id, Number(plan.min_amount),)
                    }}
                    disabled={loadingAddress}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Stake Now</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <UnstakeModal
        isOpen={unstakeModalOpen}
        onClose={() => {
          setUnstakeModalOpen(false);
          setSelectedUnstake(null);
        }}
        stake={selectedUnstake || {

          id: '0',
          amount: '0',
          earnings: '0',
          lock_period_days: '0',
          penalty: '0',
          staked_at: '0'
        }}
        ethPrice={ethPrice}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false);
          setSelectedPlan(null);
          setDepositAddress('');
        }}
        depositAddress={deposit_address!}
        minAmount={selectedPlan?.minStake || 0}
        ethPrice={ethPrice}
        error = {depositError!}
      />

      <WithdrawModal
        isOpen={withdrawrefModalOpen}
        ethPrice={ethPrice}
        balance={Number(user.earnings)}
        onClose={() => {
          setWithdrawrefModalOpen(false);

        }}

      />

      <RestakeModal
        isOpen={restakeModalOpen}
        onClose={() => {
          setRestakeModalOpen(false)
        }
        }
        stakeID={selectedRestake}
      />



    </div>
  );
}

export default Dashboard;

