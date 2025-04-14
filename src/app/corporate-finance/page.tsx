'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContentItem {
  id: string;
  section: string;
  newSectionName?: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
  templatePath?: string;
}

interface GroupedContent {
  [section: string]: ContentItem[];
}

interface ApiResponse {
  fixedSections: string[];
  content: GroupedContent;
}

export default function CorporateFinance() {
  const [content, setContent] = useState<GroupedContent>({});
  const [fixedSections, setFixedSections] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/corporate-finance');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data: ApiResponse = await response.json();
        setContent(data.content);
        setFixedSections(data.fixedSections);
        
        // Initialize all sections as expanded
        const initialExpandedState = data.fixedSections.reduce((acc, section) => {
          acc[section] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setExpandedSections(initialExpandedState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (section: string, items: ContentItem[]) => (
    <div key={section} className="mb-8">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all"
      >
        <h2 className="text-2xl font-semibold text-white">{section}</h2>
        <svg
          className={`w-6 h-6 text-white transform transition-transform ${
            expandedSections[section] ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expandedSections[section] && (
        <div className="mt-4">
          {items.length > 0 ? (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
                >
                  {item.linkType === 'external' ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-xl font-medium text-white mb-2">{item.itemName}</h3>
                      <p className="text-white/70 text-sm">External Link</p>
                    </a>
                  ) : (
                    <Link href={item.templatePath || ''}>
                      <h3 className="text-xl font-medium text-white mb-2">{item.itemName}</h3>
                      <p className="text-white/70 text-sm">View Details</p>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <p className="text-white/70">No items available in this section yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-400 text-center">{error}</div>
        </div>
      </div>
    );
  }

  const customSections = Object.keys(content).filter(section => !fixedSections.includes(section));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Corporate Finance</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Fixed Sections */}
        {fixedSections.map(section => renderSection(section, content[section] || []))}

        {/* Custom Sections */}
        {customSections.map(section => renderSection(section, content[section]))}
      </div>
    </div>
  );
} 