'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Your Portfolio</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Total Value</span>
                <span className="text-white font-bold">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">24h Change</span>
                <span className="text-green-400">+0.00%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-blue-200">No recent activity</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Add Funds
              </button>
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Start Trading
              </button>
              <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 