'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';

interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label = 'Email', error, className, ...props }, ref) => {
    return (
      <motion.div
        className={`space-y-2 ${className || ''}`}
        initial={false}
        animate={{
          scale: error ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.3, times: [0, 0.5, 1] }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <input
          id="email"
          type="email"
          ref={ref}
          className={`w-full px-4 py-3 border ${
            error ? 'border-red-500' : 'border-input'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-colors`}
          {...props}
        />
      </motion.div>
    );
  }
);

EmailInput.displayName = 'EmailInput';

export default EmailInput;