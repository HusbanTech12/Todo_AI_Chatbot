'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <motion.div
        className={`space-y-2 ${className || ''}`}
        initial={false}
        animate={{
          scale: error ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.3, times: [0, 0.5, 1] }}
      >
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            {label}
          </label>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            ref={ref}
            className={`w-full px-4 py-3 pr-12 border ${
              error ? 'border-red-500' : 'border-input'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background transition-colors`}
            {...props}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </motion.div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;