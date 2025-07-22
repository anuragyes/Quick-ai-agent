import React, { useState } from 'react';
 import Markdown   from 'react-markdown'

const Creations = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'
    >
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2 className='font-medium'>{item.prompt}</h2>
          <p className='text-gray-500'>
            {item.type} – {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>
          {item.type}
        </button>
      </div>

      {expanded && (
        <div className='mt-3'>
          {item.type === 'image' ? (
            <div>
              <img
                className='w-full max-w-md rounded'
                src={item.content}
                alt={item.prompt || 'Generated image'}
              />
            </div>
          ) : (
            <div className='text-sm text-slate-700 whitespace-pre-wrap'>
                 {/* markdown in react package wher e the context show important information in key points  */}
                <Markdown>
              {item.content}
              </Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Creations;
