'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  section: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
  templatePath?: string;
}

interface GroupedContent {
  [key: string]: ContentItem[];
}

export default function PersonalFinancePage() {
  const [content, setContent] = useState<GroupedContent>({});
  const [fixedSections, setFixedSections] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['News', 'Challenges', 'Competitions']));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/personal-finance');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setContent(data.content);
        setFixedSections(data.fixedSections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const renderSection = (section: string, items: ContentItem[]) => {
    const isExpanded = expandedSections.has(section);

    return (
      <div key={section} className="mb-8">
        <div 
          className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-t-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
          onClick={() => toggleSection(section)}
        >
          <h2 className="text-2xl font-semibold text-white">{section}</h2>
          {isExpanded ? (
            <ChevronUpIcon className="h-6 w-6 text-white" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-white" />
          )}
        </div>
        
        {isExpanded && (
          <div className="bg-white/5 backdrop-blur-lg rounded-b-xl p-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.linkType === 'external' ? item.externalUrl! : item.templatePath!}
                  target={item.linkType === 'external' ? '_blank' : '_self'}
                  className="block p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-lg font-medium text-white mb-2">{item.itemName}</h3>
                  <p className="text-sm text-white/70">
                    {item.linkType === 'external' ? 'External Link' : 'Internal Page'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Personal Finance</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Render fixed sections first */}
        {fixedSections.map(section => renderSection(section, content[section] || []))}

        {/* Render remaining sections */}
        {Object.entries(content)
          .filter(([section]) => !fixedSections.includes(section))
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([section, items]) => renderSection(section, items))}
      </div>
    </div>
  );
} 