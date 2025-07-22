


import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react'; // Assuming you're using Clerk for authentication
import toast from 'react-hot-toast'; // For notifications
import { Edit, Sparkle } from 'lucide-react';

// Set the base URL for Axios (adjust to your backend API endpoint)
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'; // Use your backend URL here

const WriteArticle = () => {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('short'); // 'short' or 'long'
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth(); // Clerk hook to get authentication token

  const handleGenerate = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!topic.trim() || !length) {
      toast.error('Please provide both content topic and length.');
      return;
    }

    const prompt = `Write an article about "${topic}".`;
    const token = await getToken();

    if (!token) {
      toast.error('Authentication token is missing.');
      return;
    }

    

    try {
      setLoading(true);

      // Make the API request to the backend to generate the article
      const { data } = await axios.post(
        '/api/ai/generate-article', // API endpoint
        { prompt, length },
        { headers: { Authorization: `Bearer ${token}` } }
      );





      // Check the backend response
      if (data.success) {
        setContent(data.content); // Set the content from the backend
        toast.success('✅ Article generated successfully');
      } else {
        toast.error(data.message || 'Failed to generate article.');
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex items-start justify-center p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">

        {/* LEFT: Form Section */}
        <form onSubmit={handleGenerate} className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-[#4A7AFF]" />
            AI Article Writer
          </h2>

          <label className="text-sm text-gray-600 block mb-1">Article Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="The future of artificial intelligence"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-sm text-gray-600 block mb-2">Article Length</label>
          <div className="flex gap-3 mb-4">
            {['short', 'long'].map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => setLength(len)}
                className={`px-4 py-2 rounded-md text-sm border ${length === len
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300'
                  }`}
              >
                {len === 'short' ? 'Short (200–400)' : 'Long (400–800)'}
              </button>
            ))}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full mt-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Edit className="w-5" />
            )}
            Generate Article
          </button>
        </form>

        {/* RIGHT: Output Section */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 min-h-[300px] max-h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">📄 Generated Article</h2>
          {content ? (
            <div className="text-gray-800 whitespace-pre-wrap text-sm">{content}</div>
          ) : (
            <div className="text-gray-400 text-sm flex flex-col items-center justify-center h-full">
              <span className="text-3xl mb-2">🖋️</span>
              Enter a topic and click <strong>"Generate Article"</strong> to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;

