import React from 'react';

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader; // <--- Yeh line missing thi