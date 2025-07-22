


import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react'; // Clerk auth
import { UploadCloud } from 'lucide-react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'; // Use your backend URL here
const RemoveBackground = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState('');

  const { getToken } = useAuth();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageSrc(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!imageSrc) {
      alert('Please upload an image first.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', imageSrc);

      const token = await getToken(); // Get token from Clerk

      const response = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setResultImage(response.data.content);
      } else {
        alert(response.data.message || 'Failed to remove background');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong while removing background');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex flex-col md:flex-row items-start justify-center gap-10 p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Remove Background</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition">
          <UploadCloud className="w-8 h-8 text-orange-500 mb-2" />
          <p className="text-gray-600 text-sm mb-1">
            Click to upload or drag an image here
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {imagePreview && (
          <div className="mt-4 border rounded overflow-hidden">
            <img src={imagePreview} alt="Uploaded" className="w-full object-cover" />
          </div>
        )}

        <button
          onClick={removeBackground}
          disabled={loading}
          className={`mt-6 w-full py-2 px-4 rounded-md text-white font-semibold transition ${
            loading
              ? 'bg-orange-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600'
          }`}
        >
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>
        {resultImage ? (
          <img
            src={resultImage}
            alt="Result"
            className="rounded-md border shadow-sm w-full"
          />
        ) : (
          <p className="text-gray-400 text-sm text-center">
            Upload an image and click "Remove Background" to see the result here.
          </p>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;

