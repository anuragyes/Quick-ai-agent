// import React, { useState } from 'react';
// import { Sparkle, Hash } from 'lucide-react'
// import {useAuth}  from '@clerk/clerk-react'
// import toast from 'react-hot-toast'
// import Markdown from 'react-markdown'
// import axios from 'axios';


// const categories = [
//   'General',
//   'Technology',
//   'Business',
//   'Health',
//   'Lifestyle',
//   'Education',
//   'Travel',
//   'Food',
// ];
//   axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// const Blog = () => {
//   const [keyword, setKeyword] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('General');
//   const [generatedTitles, setGeneratedTitles] = useState([]);


//    const [loading, setloading] = useState(false)
//     const [content, setcontent] = useState('')

//        const {getToken} = useAuth();




//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!keyword) return;

//     // Simulate title generation
//     const titles = [
//       `Top 10 ${selectedCategory} Trends About "${keyword}"`,
//       `How "${keyword}" Is Shaping The Future of ${selectedCategory}`,
//       `The Ultimate Guide to "${keyword}" in ${selectedCategory}`,
//     ];



//        try {
        
//        } catch (error) {
        
//        }
//     setGeneratedTitles(titles);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex items-start justify-center p-10">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">

//         {/* LEFT: Form Section */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-xl shadow border border-gray-200"
//         >
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <Sparkle className="w-6 h-6 text-purple-600" />
//             AI Title Generator
//           </h2>

//           <label className="text-sm text-gray-600 block mb-1">Keyword</label>
//           <input
//             type="text"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             placeholder="The future of artificial intelligence"
//             className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />

//           <label className="text-sm text-gray-600 block mb-2">Category</label>
//           <div className="grid grid-cols-3 gap-2 mb-4">
//             {categories.map((cat) => (
//               <button
//                 type="button"
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-3 py-2 rounded-md text-sm border text-center ${selectedCategory === cat
//                     ? 'bg-purple-100 text-purple-700 border-purple-300'
//                     : 'bg-white text-gray-700 border-gray-300'
//                   }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 px-4 rounded-md flex justify-center items-center gap-2"
//           >
//             <Hash className="w-4 h-4" />
//             Generate title
//           </button>
//         </form>

//         {/* RIGHT: Generated Titles */}
//         <div className="bg-white p-6 rounded-xl shadow border border-gray-200 min-h-[300px]">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <Hash className="w-5 h-5 text-gray-700" />
//             Generated titles
//           </h2>

//           {generatedTitles.length > 0 ? (
//             <ul className="text-gray-800 text-sm list-disc pl-4 space-y-2">
//               {generatedTitles.map((title, idx) => (
//                 <li key={idx}>{title}</li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-gray-400 text-sm flex flex-col items-center justify-center h-full">
//               <Hash className="w-8 h-8 mb-2" />
//               Enter keywords and click <strong>"Generate title"</strong> to get started.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Blog;



import React, { useState } from 'react';
import { Sparkle, Hash } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Markdown from 'react-markdown';

const categories = [
  'General',
  'Technology',
  'Business',
  'Health',
  'Lifestyle',
  'Education',
  'Travel',
  'Food',
];

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const Blog = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast.error('Please enter a keyword.');
      return;
    }

    const prompt = `Write a detailed blog post about "${keyword}" in the category "${selectedCategory}".`;

    try {
      setLoading(true);
      setContent('');
      setGeneratedTitles([]);

      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-blog',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Basic title generation (can be removed if backend returns titles)
        const titles = [
          `Top Insights on "${keyword}" in ${selectedCategory}`,
          `How "${keyword}" Impacts ${selectedCategory}`,
          `What You Should Know About "${keyword}"`,
        ];
        setGeneratedTitles(titles);

        setContent(data.content);
      } else {
        toast.error(data.message || 'Failed to generate blog');
      }
    } catch (error) {
      console.error('Error generating blog:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex items-start justify-center p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* LEFT: Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-purple-600" />
            AI Blog Generator
          </h2>

          {/* Keyword input */}
          <label className="text-sm text-gray-600 block mb-1">Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="The future of artificial intelligence"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Category selection */}
          <label className="text-sm text-gray-600 block mb-2">Category</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-md text-sm border text-center ${
                  selectedCategory === cat
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 px-4 rounded-md flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Hash className="w-4 h-4" />
                Generate Blog
              </>
            )}
          </button>
        </form>

        {/* RIGHT: Output Section */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 min-h-[300px] overflow-y-auto max-h-[600px]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-gray-700" />
            Blog Output
          </h2>

          {generatedTitles.length > 0 && (
            <ul className=" text-gray-800 text-sm list-disc pl-4 space-y-2 mb-4">
              {generatedTitles.map((title, idx) => (
                <li key={idx}>{title}</li>
              ))}
            </ul>
          )}

          {content ? (
            <div className="prose prose-sm max-w-none">
              <Markdown>{content}</Markdown>
            </div>
          ) : (
            <div className="text-gray-400 text-sm flex flex-col items-center justify-center h-full">
              <Hash className="w-8 h-8 mb-2" />
              Enter a keyword and click <strong>"Generate Blog"</strong> to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 

export default Blog;
