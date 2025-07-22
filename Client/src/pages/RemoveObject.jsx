

import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

const RemoveObject = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [objectName, setObjectName] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();


  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'; // Use your backend URL here

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveObject = async () => {
    if (!imageFile || !objectName.trim()) {
      alert('Please upload an image and enter an object name.');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('object', objectName);

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        setResultImage(data.content);
      } else {
        alert(data.message || 'Object removal failed');
      }
    } catch (error) {
      console.error('Remove object error:', error);
      alert('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex flex-col md:flex-row items-start justify-center gap-10 p-8">
      {/* Left: Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Remove Object</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition">
          <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
          <p className="text-gray-600 text-sm mb-1">
            Click to upload or drag an image here
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {imagePreview && (
          <div className="mt-4 border rounded overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full object-cover" />
          </div>
        )}

        <textarea
          rows="2"
          placeholder="Enter object to remove (e.g., chair, cup)"
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
          className="mt-4 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleRemoveObject}
          disabled={loading}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold transition ${
            loading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
          }`}
        >
          {loading ? 'Processing...' : '✂️ Remove Object'}
        </button>
      </div>

      {/* Right: Result Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>
        {resultImage ? (
          <img src={resultImage} alt="Processed Result" className="rounded border shadow" />
        ) : (
          <div className="text-gray-400 text-sm text-center">
            <div className="text-4xl mb-2">✂️</div>
            Upload an image and click <strong>"Remove Object"</strong> to see the result here.
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;

