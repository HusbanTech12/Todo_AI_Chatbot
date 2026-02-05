'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface AuthFooterProps {
  message: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({ message, linkText, href }: AuthFooterProps) {
  return (
    <motion.div
      className="mt-6 text-center text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {message}{' '}
      <Link
        href={href}
        className="font-medium text-primary hover:text-primary/90 transition-colors underline-offset-4 hover:underline"
      >
        {linkText}
      </Link>
    </motion.div>
  );
}