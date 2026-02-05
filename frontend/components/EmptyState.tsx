'use client';

import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md">
        <div className="bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to your chat</h3>
        <p className="text-muted-foreground">
          Start a conversation by sending a message. Your AI assistant is ready to help.
        </p>
      </div>
    </motion.div>
  );
}