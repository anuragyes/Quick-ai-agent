

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();
  const currentUserId = user?.id;

  const fetchCreations = async () => {
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
        toast.error(data.message || 'Failed to load creations');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching creations');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        '/api/user/get-toggle-creations',
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCreations(); // Refresh data
      } else {
        toast.error(data.message || 'Failed to toggle like');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error toggling like');
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Creations</h1>

      {loading ? (
        <p className="text-gray-500">Loading creations...</p>
      ) : creations.length === 0 ? (
        <p className="text-gray-400">No creations found.</p>
      ) : (
        <div className="bg-white h-full w-full rounded-xl overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {creations.map((creation) => (
            <div
              key={creation.id}
              className="relative group inline-block w-full overflow-hidden rounded-lg shadow"
            >
              <img
                src={creation.content}
                alt={creation.prompt}
                 className="w-[1200px] h-[900px] object-cover rounded-lg"
              />

              {/* Prompt on hover */}
              <p className="text-sm hidden group-hover:block absolute bottom-16 left-0 right-0 bg-black bg-opacity-60 text-white px-4 py-2">
                {creation.prompt}
              </p>

              {/* Like counter */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full shadow">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={() => toggleLike(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer transition ${
                    creation.likes.includes(currentUserId)
                      ? 'fill-red-500 text-red-600'
                      : 'text-gray-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;

