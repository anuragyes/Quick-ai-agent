import React from 'react';
import { PricingTable } from '@clerk/clerk-react';

const Plan = () => {
  return (
    <div className="my-24 px-4 sm:px-8 xl:px-32">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto mt-4">
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* Pricing Table Section */}
      <div className="mt-14 flex justify-end max-sm:justify-center">
        <div className="w-full max-w-6xl">
          <PricingTable />
        </div>
      </div>
    </div>
  );
};

export default Plan;
