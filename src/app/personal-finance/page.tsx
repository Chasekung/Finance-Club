'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PersonalFinance() {
  const [expandedSections, setExpandedSections] = useState({
    news: false,
    challenges: false,
    competitions: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Personal Finance</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* News Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('news')}
            className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            <h2 className="text-xl font-semibold text-white">News</h2>
            <svg
              className={`w-6 h-6 text-white transform transition-transform ${
                expandedSections.news ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.news && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <p className="text-blue-200">No news articles available at this time.</p>
            </div>
          )}
        </div>

        {/* Challenges Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('challenges')}
            className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            <h2 className="text-xl font-semibold text-white">Challenges</h2>
            <svg
              className={`w-6 h-6 text-white transform transition-transform ${
                expandedSections.challenges ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.challenges && (
            <div className="mt-4 space-y-3">
              <button className="w-full p-4 bg-green-500/20 text-white rounded-lg hover:bg-green-500/30 transition-colors text-left">
                Investopedia Simulator
              </button>
            </div>
          )}
        </div>

        {/* Competitions Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('competitions')}
            className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            <h2 className="text-xl font-semibold text-white">Competitions</h2>
            <svg
              className={`w-6 h-6 text-white transform transition-transform ${
                expandedSections.competitions ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.competitions && (
            <div className="mt-4 space-y-3">
              <button className="w-full p-4 bg-green-500/20 text-white rounded-lg hover:bg-green-500/30 transition-colors text-left">
                NPFC
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 