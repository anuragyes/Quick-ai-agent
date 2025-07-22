


import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
 import { assets } from '../assets/assets/assets';
import { Menu as MenuIcon, X } from 'lucide-react';
import { SignIn, useUser } from '@clerk/clerk-react';
 import Sidebar from '../components/Sidebar';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser(); // ✅ Fix: user was not destructured before

  if (!user) return <SignIn />;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle button */}
      <div className="sm:hidden fixed top-4 left-4 z-40">
        {sidebarOpen ? (
          <X
            className="w-6 h-6 cursor-pointer text-slate-700"
            onClick={() => setSidebarOpen(false)}
          />
        ) : (
          <MenuIcon
            className="w-6 h-6 cursor-pointer text-slate-700"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </div>

      {/* Sidebar */}
      <Sidebar sidebar={sidebarOpen} setsidebar={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 ml-0 sm:ml-64 p-6 overflow-y-auto w-full">
        {/* Header Logo (desktop only) */}
        <div className="hidden sm:block mb-4">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-32 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
