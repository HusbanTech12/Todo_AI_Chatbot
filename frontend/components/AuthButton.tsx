'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth';
import Link from 'next/link';

interface AuthButtonProps {
  onUserChange?: (user: any) => void;
}

const AuthButton = ({ onUserChange }: AuthButtonProps) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authClient.getSession();
        setUser(currentUser?.data?.user || null);
        if (onUserChange) {
          onUserChange(currentUser?.data?.user || null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        if (onUserChange) {
          onUserChange(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Note: Better Auth handles session changes automatically with useSession hook
    // Additional manual subscription is not needed
  }, [onUserChange]);

  if (isLoading) {
    return (
      <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {user ? (
        <>
          <span className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[100px]">
            {user.name || user.email}
          </span>
          <button
            onClick={async () => {
              await authClient.signOut();
            }}
            className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border border-border"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link href="/login">
          <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </button>
        </Link>
      )}
    </div>
  );
};

export default AuthButton;