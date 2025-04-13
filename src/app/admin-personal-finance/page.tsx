'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPersonalFinance() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (!user.isAdmin) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Personal Finance</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Content Management</h2>
          <p className="text-blue-200 text-lg">Will be added soon</p>
        </div>
      </div>
    </div>
  );
} 