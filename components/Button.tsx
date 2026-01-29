
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  withIcon?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  withIcon = false,
  loading = false,
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 box-border";
  
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-brand-orangeHover shadow-orange-500/20 border-2 border-transparent",
    secondary: "bg-white text-brand-blue border-2 border-brand-blue hover:bg-blue-50 shadow-blue-500/5",
    outline: "border-2 border-white text-white hover:bg-white/10"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : null}
      {children}
      {withIcon && !loading && <ArrowRight className="ml-2 w-5 h-5" />}
    </button>
  );
};

export default Button;
