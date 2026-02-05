'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface AuthErrorProps {
  message: string;
}

export default function AuthError({ message }: AuthErrorProps) {
  return (
    <motion.div
      className="flex items-center p-4 text-sm text-error bg-destructive/10 border border-destructive/20 rounded-lg"
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <AlertCircle className="h-4 w-4 mr-3 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}