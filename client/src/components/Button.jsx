import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};