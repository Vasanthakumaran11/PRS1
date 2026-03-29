import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 w-full animate-pulse shadow-sm flex flex-col h-[340px]">
      <div className="bg-gray-200 aspect-square rounded-lg w-full mb-4"></div>
      <div className="flex flex-col flex-1 pb-2">
        <div className="h-3 w-1/3 bg-gray-200 rounded-full mb-3"></div>
        <div className="h-5 w-full bg-gray-200 rounded-md mb-2"></div>
        <div className="h-5 w-2/3 bg-gray-200 rounded-md mb-4 mt-1"></div>
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <div className="h-4 w-1/2 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-6 w-1/3 bg-gray-200 rounded-md mt-1"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
