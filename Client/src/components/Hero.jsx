


import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 bg-gradient-to-br from-[#e0f2ff] via-[#f5e1ff] to-[#f9f9f9]">
            <div className="max-w-4xl">
                <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight text-black">
                    Create amazing content <br />
                    with <span className="text-primary text-blue-700">AI tools</span>
                </h1>
                <p className="text-sm sm:text-base mt-6 text-gray-600 max-w-xl mx-auto">
                    Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.
                </p>
            </div>

            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>

                <button onClick={() => {
                    navigate("/ai")
                }} className='bg-primary  text-sm  px-10 py-3  border bg-blue-600 rounded-lg hover:scale-105 active:scale-95 transition transform cursor-pointer'>
                    Start creating now
                </button>
                <button className='bg-white text-primary px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition transform cursor-pointer'>
                    Watch demo
                </button>
            </div>

             <div className='flex items-center gap-4 mt-8 max-auto text-gray-600'>
                {/* <img src={assets.user_group} alt=""className='h-8'/>  Trusted By12k  people */}
             </div>

        </section>
    );
};

export default Hero;
