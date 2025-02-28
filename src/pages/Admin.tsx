import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import {
  Users,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Download,
  ArrowUpDown,
  MoreVertical,
  Shield
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in: string;
}

interface Stake {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  daily_yield: number;
  start_date: string;
  end_date: string;
  status: string;
  total_earned: number;
}

export function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStakes: 0,
    totalStaked: 0,
    totalEarned: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });

  // Check if user is admin
  useEffect(() => {
    console.log(sortConfig);
    const checkAdmin = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      console.log(users)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/dashboard');
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (userError) throw userError;

        // Fetch stakes
        const { data: stakeData, error: stakeError } = await supabase
          .from('stakes')
          .select('*')
          .order('created_at', { ascending: false });

        if (stakeError) throw stakeError;

        setUsers(userData);
        setStakes(stakeData);

        // Calculate stats
        const activeStakes = stakeData.filter(stake => stake.status === 'active');
        setStats({
          totalUsers: userData.length,
          activeStakes: activeStakes.length,
          totalStaked: activeStakes.reduce((sum, stake) => sum + stake.amount, 0),
          totalEarned: stakeData.reduce((sum, stake) => sum + stake.total_earned, 0)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedStakes = stakes
    .filter(stake => 
      (statusFilter === 'all' || stake.status === statusFilter) &&
      (searchTerm === '' || 
        stake.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stake.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Platform management and monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center space-x-2 text-sm transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Exit Admin Mode</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Users</p>
                <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
                <p className="text-sm text-slate-400">Registered accounts</p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Stakes</p>
                <p className="text-2xl font-bold mt-2">{stats.activeStakes}</p>
                <p className="text-sm text-slate-400">Current positions</p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Staked</p>
                <p className="text-2xl font-bold mt-2">{stats.totalStaked.toFixed(2)} ETH</p>
                <p className="text-sm text-slate-400">In active stakes</p>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Earned</p>
                <p className="text-2xl font-bold mt-2">{stats.totalEarned.toFixed(2)} ETH</p>
                <p className="text-sm text-slate-400">Platform-wide earnings</p>
              </div>
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stakes Management */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold">Stakes Management</h2>
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stakes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending_deposit">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => {/* Export functionality */}}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center space-x-2 text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-400"
                    >
                      <span>Stake ID</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('user_id')}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-400"
                    >
                      <span>User</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('plan')}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-400"
                    >
                      <span>Plan</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-400"
                    >
                      <span>Amount</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-400"
                    >
                      <span>Status</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('start_date')}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-400"
                    >
                      <span>Start Date</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStakes.map((stake) => (
                  <tr key={stake.id} className="border-t border-slate-700/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{stake.id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{stake.user_id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4">{stake.plan}</td>
                    <td className="px-6 py-4">{stake.amount.toFixed(4)} ETH</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stake.status === 'active' ? 'bg-green-500/10 text-green-400' :
                        stake.status === 'pending_deposit' ? 'bg-yellow-500/10 text-yellow-400' :
                        stake.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {stake.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {stake.status === 'pending_deposit' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {stake.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {stake.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                        {stake.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(stake.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}