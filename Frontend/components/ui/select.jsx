"use client";
import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown, AlertCircle } from 'lucide-react';

const Select = forwardRef(({
  className,
  label,
  error,
  description,
  fullWidth = true,
  children,
  ...props
}, ref) => {
  const selectClasses = clsx(
    'block w-full rounded-lg border-0 py-2.5 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
    'focus:ring-2 focus:ring-inset focus:ring-primary',
    'sm:text-sm sm:leading-6',
    'appearance-none bg-white',
    'transition-all duration-200',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    error 
      ? 'ring-red-300 focus:ring-red-500 text-red-900' 
      : 'focus:ring-primary',
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
        <select
          ref={ref}
          className={selectClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        >
          {children}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {error ? (
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </div>
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

Select.displayName = 'Select';

export { Select };
export default Select;
