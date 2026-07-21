import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-brand-red hover:bg-brand-red-hover shadow-sm disabled:hover:bg-brand-red",
    outline: "border-brand-blue text-brand-blue bg-transparent hover:bg-brand-blue/5",
    ghost: "border-transparent text-brand-blue hover:bg-brand-slate/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;