import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none';
  const widthStyles = fullWidth ? 'w-full' : '';
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline:
      'border-2 border-slate-200 text-slate-700 bg-transparent hover:bg-slate-50 hover:border-slate-300',
  }[variant];

  return (
    <button className={`${baseStyles} ${widthStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};
