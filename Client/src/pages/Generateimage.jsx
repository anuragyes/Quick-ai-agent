

import React, { useState } from 'react';
import { Image, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const styles = [
  'Realistic',
  'Ghibli style',
  'Anime style',
  'Cartoon style',
  'Fantasy style',
  'Realistic style',
  '3D style',
  'Portrait style',
];

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const Generateimage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [isPublic, setIsPublic] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

   const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'my-image.jpg'; // filename you want for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }

    try {
      setLoading(true);
      setGeneratedImage('');

      const fullPrompt = `Generate an image of ${prompt} in the style of ${selectedStyle}`;
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-img',
        {
          prompt: fullPrompt,
          publish: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setGeneratedImage(data.content);
      } else {
        alert(data.message || 'Image generation failed.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert(error?.response?.data?.message || 'An error occurred while generating the image.');
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
            <Sparkles className="w-6 h-6 text-green-600" />
            AI Image Generator
          </h2>

          {/* Prompt Input */}
          <label className="text-sm text-gray-600 block mb-1">Describe Your Image</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A young boy playing with a cat"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 h-28 resize-none"
          />

          {/* Style Selection */}
          <label className="text-sm text-gray-600 block mb-2">Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {styles.map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-2 rounded-md text-sm border ${selectedStyle === style
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300'
                  }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Public Toggle */}
          <div className="flex items-center mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition-colors duration-300">
                <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
              </div>
              <span className="ml-3 text-sm text-gray-600">Make this image Public</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex justify-center items-center gap-2 transition"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Image className="w-4 h-4" />
                Generate Image
              </>
            )}
          </button>

          {/* ✅ Download Button (only if image is generated) */}
          {generatedImage && (
            <a   
              onClick={handleDownload}
              className="mt-4 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition block"
            >
              Download Image
            </a>
          )}
        </form>

        {/* RIGHT: Generated Image Display */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 min-h-[300px] flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-gray-700" />
            Generated image
          </h2>

          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated"
              className="rounded-lg border border-gray-300 max-w-full"
            />
          ) : (
            <div className="text-gray-400 text-sm flex flex-col items-center justify-center h-full text-center">
              <Image className="w-8 h-8 mb-2" />
              Enter a prompt and click <strong>"Generate image"</strong> to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generateimage;
