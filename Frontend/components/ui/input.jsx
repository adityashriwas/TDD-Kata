"use client";
import { forwardRef } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  className,
  label,
  error,
  description,
  leftIcon,
  rightIcon,
  fullWidth = true,
  ...props
}, ref) => {
  const inputClasses = clsx(
    'block w-full rounded-lg border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
    'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary',
    'sm:text-sm sm:leading-6',
    'transition-all duration-200',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    error 
      ? 'ring-red-300 focus:ring-red-500 text-red-900' 
      : 'focus:ring-primary',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );

  return (
    <div className={clsx('space-y-1.5', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {error ? (
        <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      ) : description ? (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
