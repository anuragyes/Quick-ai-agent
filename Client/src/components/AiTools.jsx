import React from 'react';
import { AiToolsData } from '../assets/assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast, Toaster } from 'react-hot-toast'; // Import toast

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const checkuser = (tool) => {
    if (!user) {
      // Show toast message when user is not logged in
      toast("Please register or login to access AI tools", {
        position: "top-center",
        duration: 4000,
      });
    } else {
      // Navigate to the tool's path if the user is logged in
      navigate(tool.path);
    }
  }

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      {/* Section Heading */}
      <div className='text-center mb-10'>
        <h2 className='text-slate-700 text-3xl sm:text-4xl font-semibold'>
          Powerful AI Tools
        </h2>
        <p className='text-gray-500 max-w-lg mx-auto mt-4'>
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      {/* Tool Cards */}
      <div className='flex flex-wrap justify-center gap-6'>
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => checkuser(tool)} // Pass tool as argument
            className='p-8 max-w-xs w-full sm:w-[280px] rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
          >
            <tool.Icon
              className='w-12 h-12 p-3 rounded-xl mb-4'
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />
            <h3 className='text-lg font-semibold mb-2'>{tool.title}</h3>
            <p className='text-sm text-gray-600'>{tool.description}</p>
          </div>
        ))}
      </div>

      {/* Toaster container to show toast messages */}
      <Toaster position="top-center" />
    </div>
  );
};

export default AiTools;
