'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  username: string;
  fullName: string;
  isAdmin: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have a session
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        // Then get user data from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('No user data');
        }

        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">Welcome, {user.fullName}</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              user.isAdmin 
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
            }`}>
              {user.isAdmin ? 'Admin' : 'User'}
            </span>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' });
              localStorage.removeItem('user');
              router.push('/home');
              router.refresh();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[calc(100vh-12rem)]">
          {/* Directory Box */}
          <Link href="/directory" className="block h-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full hover:bg-white/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Directory</h2>
              </div>
              <p className="text-blue-200">View and search through all club members, organized by role and alphabetically.</p>
            </div>
          </Link>

          {/* Personal Finance Box */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Personal Finance</h2>
            </div>
            <div className="space-y-3">
              <Link 
                href="/personal-finance"
                className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
              >
                View Personal Finance
              </Link>
              {user.isAdmin ? (
                <Link 
                  href="/admin-personal-finance"
                  className="block w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-center"
                >
                  Manage Content
                </Link>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg text-center cursor-not-allowed">
                  Admins only!
                </div>
              )}
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 3</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Box 4 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 4</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Box 5 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 5</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Box 6 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 6</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Box 7 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 7</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Box 8 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 8</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Box 9 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 h-full">
            <h2 className="text-xl font-semibold text-white mb-4">Title 9</h2>
            <div className="space-y-4 h-[calc(100%-3rem)]">
              {/* Content will go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 