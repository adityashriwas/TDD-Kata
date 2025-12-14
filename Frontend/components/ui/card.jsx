import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = forwardRef(({ className, hoverable = true, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden',
        'transition-all duration-200',
        hoverable && 'hover:shadow-md hover:border-gray-200',
        className
      )}
      {...props}
    />
  );
});

const CardHeader = ({ className, ...props }) => (
  <div
    className={clsx('px-6 py-4 border-b border-gray-100', className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={clsx('text-lg font-semibold text-gray-900', className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }) => (
  <p className={clsx('mt-1 text-sm text-gray-500', className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={clsx('p-6', className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div
    className={clsx(
      'px-6 py-4 bg-gray-50 border-t border-gray-100',
      'flex items-center justify-between',
      className
    )}
    {...props}
  />
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

export default Card;
