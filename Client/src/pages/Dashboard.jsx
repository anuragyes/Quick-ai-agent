import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gem, Sparkles } from 'lucide-react';
import Creation from '../components/Creations';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

// Optional: you can remove this if unused
// import { dummyCreationData } from '../assets/assets/assets';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Dummy Protect plan checker — replace with real plan logic if available
const Protect = ({ plan, fallback, children }) => {
  return <div className="text-lg font-semibold mt-2">{plan === 'premium' ? children : fallback}</div>;
};

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || 'Failed to fetch creations.');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">

        {/* Total Creation Card */}
        <div className="flex flex-col justify-between w-72 p-4 bg-white px-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">
              <p className="text-sm">Total Creation</p>
            </div>
            <div className="w-10 h-9 rounded-md bg-gradient-to-br from-[#3588F2] to-[#0BBD7] text-white flex justify-center items-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-xl font-semibold mt-2">
            {loading ? '...' : creations.length}
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex flex-col justify-between w-72 p-4 bg-white px-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">
              <p className="text-sm">Active Plan</p>
            </div>
            <div className="w-10 h-9 rounded-md bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
          </div>
          <Protect plan="premium" fallback="Free">Premium</Protect>
        </div>

      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creation</p>
        {loading ? (
          <p className="text-gray-400">Loading creations...</p>
        ) : creations.length > 0 ? (
          creations.map((item) => <Creation key={item.id} item={item} />)
        ) : (
          <p className="text-gray-400">No creations found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
