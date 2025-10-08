import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skylight-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Input;