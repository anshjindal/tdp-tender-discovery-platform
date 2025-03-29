import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  overlay?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#3498db',
  className = '',
  overlay = false,
  message
}) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };

  const spinner = (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-t-transparent ${sizeMap[size]}`}
        style={{ borderColor: color, borderTopColor: 'transparent' }}
        aria-label="Loading"
      />
      {message && (
        <span className="mt-2 text-sm font-medium" style={{ color }}>
          {message}
        </span>
      )}
    </div>
  );

  return overlay ? (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
      {spinner}
    </div>
  ) : (
    spinner
  );
};

export default LoadingSpinner;