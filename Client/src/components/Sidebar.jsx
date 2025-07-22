

import React from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

import {
  Pencil,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  User2Icon,
} from 'lucide-react';

const Sidebar = ({ sidebar, setsidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  const links = [
    { label: 'Write Article', icon: <Pencil size={18} />, path: '/ai/write-article' },
    { label: 'Blog Titles', icon: <Hash size={18} />, path: '/ai/blog' },
    { label: 'Generate Images', icon: <Image size={18} />, path: '/ai/generateimage' },
    { label: 'Remove Background', icon: <Eraser size={18} />, path: '/ai/removebackground' },
    { label: 'Remove Object', icon: <Scissors size={18} />, path: '/ai/removeobject' },
    { label: 'Review Resume', icon: <FileText size={18} />, path: '/ai/reviewresume' },
      { label: 'Community', icon: <User2Icon size={18} />, path: '/ai/community' },
  ];

  return (
    <aside
      className={`bg-white shadow-md w-64 h-full fixed top-0 left-0 z-30 transform 
        transition-transform duration-300 ease-in-out 
        ${sidebar ? 'translate-x-0' : '-translate-x-full'} 
        sm:translate-x-0`}
    >
      <div className="p-6 flex flex-col h-full justify-between text-slate-700">
        {/* User Info */}
        <div>
          <img
            src={user.imageUrl}
            alt="User"
            className="w-20 h-20 rounded-full mx-auto mb-4 border border-gray-200"
          />
          <h2 className="text-center text-sm text-gray-600 mb-6">
            Hello, {user.fullName}
          </h2>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 text-sm">
            {links.map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(link.path);
                  setsidebar(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-md 
                  text-slate-700 hover:text-white 
                  hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 
                  transition-all duration-300 text-left"
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile / Sign Out */}
        <div className="flex flex-col gap-2 text-sm mt-6">
          <button
            onClick={openUserProfile}
            className="text-left px-3 py-2 hover:text-indigo-600 transition-colors"
          >
            View Profile
          </button>

          <button
            onClick={() => signOut()}
            className="text-left px-3 py-2 rounded-md 
              text-white bg-gradient-to-r from-red-500 to-red-600 
              hover:from-red-600 hover:to-red-700 
              transition-all duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
