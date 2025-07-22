import React from 'react';


 import { assets } from '../assets/assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className='fixed z-50 flex w-full backdrop-blur-2xl justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
      <img
        onClick={() => navigate('/')}
        className='w-32 sm:w-44 cursor-pointer'
        src={assets.logo}
        alt="Logo"
      />

      {user ? (
        <UserButton />
      ) : (
       <button
  onClick={() => openSignIn()}
  className="flex items-center gap-2 rounded-full text-black  px-6 sm:px-10 py-2.5 text-sm sm:text-base font-medium shadow-md bg-red-300 hover:bg-red-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
>
  Get Started
  <ArrowRight className="w-5 h-5" />
</button>

      )}
    </div>
  );
};

export default Navbar;
