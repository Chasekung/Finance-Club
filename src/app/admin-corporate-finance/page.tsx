'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Section {
  id: string;
  name: string;
}

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

export default function AdminCorporateFinance() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [itemName, setItemName] = useState('');
  const [linkType, setLinkType] = useState<'external' | 'internal'>('external');
  const [externalUrl, setExternalUrl] = useState('');
  const [internalUrl, setInternalUrl] = useState('');
  const [showInternalOptions, setShowInternalOptions] = useState(false);
  const [includeInstructions, setIncludeInstructions] = useState(false);
  const [includeTeams, setIncludeTeams] = useState(false);
  const [includeMainActivity, setIncludeMainActivity] = useState(false);
  const [includeLeaderboard, setIncludeLeaderboard] = useState(false);
  const [includeTitle, setIncludeTitle] = useState(false);
  const [titleContent, setTitleContent] = useState('');
  
  // New state for feature content
  const [instructionsContent, setInstructionsContent] = useState('');
  const [teamsContent, setTeamsContent] = useState('');
  const [mainActivityContent, setMainActivityContent] = useState('');
  const [leaderboardContent, setLeaderboardContent] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [content, setContent] = useState<GroupedContent>({});
  const [fixedSections, setFixedSections] = useState<string[]>([]);
  const [showViewDelete, setShowViewDelete] = useState(false);
  const [sortBy, setSortBy] = useState<'section' | 'type'>('section');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  const sections: Section[] = [
    { id: 'news', name: 'News' },
    { id: 'challenges', name: 'Challenges' },
    { id: 'competitions', name: 'Competitions' }
  ];

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

    fetchContent();
  }, [router]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/corporate-finance');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data: ApiResponse = await response.json();
      setContent(data.content);
      setFixedSections(data.fixedSections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/corporate-finance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: selectedSection,
          newSectionName,
          itemName,
          linkType,
          externalUrl,
          internalUrl,
          includeTitle,
          includeInstructions,
          includeTeams,
          includeMainActivity,
          includeLeaderboard,
          titleContent,
          instructionsContent,
          teamsContent,
          mainActivityContent,
          leaderboardContent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create content');
      }

      setSuccess('Content created successfully!');
      
      // Reset form
      setIsCreateOpen(false);
      setSelectedSection('');
      setNewSectionName('');
      setItemName('');
      setLinkType('external');
      setExternalUrl('');
      setInternalUrl('');
      setShowInternalOptions(false);
      setIncludeInstructions(false);
      setIncludeTeams(false);
      setIncludeMainActivity(false);
      setIncludeLeaderboard(false);
      setIncludeTitle(false);
      setTitleContent('');
      setInstructionsContent('');
      setTeamsContent('');
      setMainActivityContent('');
      setLeaderboardContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/corporate-finance/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
  };

  const handleUpdate = async (updatedItem: ContentItem) => {
    try {
      const response = await fetch(`/api/corporate-finance/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
      setEditingItem(null);
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const renderContentList = () => {
    const allItems = Object.entries(content).flatMap(([section, items]) =>
      items.map(item => ({ ...item, section }))
    );

    const sortedItems = [...allItems].sort((a, b) => {
      if (sortBy === 'section') {
        return a.section.localeCompare(b.section);
      } else {
        return a.linkType.localeCompare(b.linkType);
      }
    });

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'section' | 'type')}
            className="px-4 py-2 bg-white/10 text-white rounded-lg"
          >
            <option value="section">Sort by Section</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>

        <div className="grid gap-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium text-white">{item.itemName}</h3>
                  <p className="text-white/70">
                    Section: {item.section} | Type: {item.linkType}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Corporate Finance</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Create Button */}
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all text-white text-xl font-semibold"
          >
            {isCreateOpen ? 'Close' : 'Create'}
          </button>

          {/* View/Delete Button */}
          <button
            onClick={() => setShowViewDelete(!showViewDelete)}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all text-white text-xl font-semibold"
          >
            View/Delete
          </button>

          {/* Creation Box */}
          {isCreateOpen && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
              <div className="space-y-6">
                {/* Section Selection */}
                <div className="space-y-2">
                  <label className="block text-white">Select Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Select a section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                    <option value="new">Create New Section</option>
                  </select>
                </div>

                {/* New Section Name */}
                {selectedSection === 'new' && (
                  <div className="space-y-2">
                    <label className="block text-white">New Section Name</label>
                    <input
                      type="text"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Enter section name"
                    />
                  </div>
                )}

                {/* Item Name */}
                <div className="space-y-2">
                  <label className="block text-white">Item Name</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Link Type */}
                <div className="space-y-2">
                  <label className="block text-white">Link Type</label>
                  <select
                    value={linkType}
                    onChange={(e) => {
                      setLinkType(e.target.value as 'external' | 'internal');
                      setShowInternalOptions(e.target.value === 'internal');
                    }}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="external">External URL</option>
                    <option value="internal">Internal Page</option>
                  </select>
                </div>

                {/* External URL */}
                {linkType === 'external' && (
                  <div className="space-y-2">
                    <label className="block text-white">External URL</label>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {/* Internal URL Options */}
                {showInternalOptions && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-white">Internal URL</label>
                      <div className="flex items-center">
                        <span className="text-white/70 mr-2">/corporate-finance/</span>
                        <input
                          type="text"
                          value={internalUrl}
                          onChange={(e) => setInternalUrl(e.target.value)}
                          className="flex-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          placeholder="accounting"
                        />
                      </div>
                      <p className="text-sm text-white/60">
                        Enter the last part of the URL (e.g., "accounting" for /corporate-finance/accounting)
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-white">Additional Features</label>
                      <div className="space-y-4">
                        {/* Title Box */}
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-white">
                            <input
                              type="checkbox"
                              checked={includeTitle}
                              onChange={(e) => setIncludeTitle(e.target.checked)}
                              className="rounded"
                            />
                            <span>Include Title Box</span>
                          </label>
                          {includeTitle && (
                            <textarea
                              value={titleContent}
                              onChange={(e) => setTitleContent(e.target.value)}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                              placeholder="Enter title content"
                              rows={2}
                            />
                          )}
                        </div>

                        {/* Instructions Box */}
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-white">
                            <input
                              type="checkbox"
                              checked={includeInstructions}
                              onChange={(e) => setIncludeInstructions(e.target.checked)}
                              className="rounded"
                            />
                            <span>Include Instructions Box</span>
                          </label>
                          {includeInstructions && (
                            <textarea
                              value={instructionsContent}
                              onChange={(e) => setInstructionsContent(e.target.value)}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                              placeholder="Enter instructions content"
                              rows={4}
                            />
                          )}
                        </div>

                        {/* Teams Table */}
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-white">
                            <input
                              type="checkbox"
                              checked={includeTeams}
                              onChange={(e) => setIncludeTeams(e.target.checked)}
                              className="rounded"
                            />
                            <span>Include Teams Table</span>
                          </label>
                          {includeTeams && (
                            <textarea
                              value={teamsContent}
                              onChange={(e) => setTeamsContent(e.target.value)}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                              placeholder="Enter team names (one per line)"
                              rows={4}
                            />
                          )}
                        </div>

                        {/* Main Activity Box */}
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-white">
                            <input
                              type="checkbox"
                              checked={includeMainActivity}
                              onChange={(e) => setIncludeMainActivity(e.target.checked)}
                              className="rounded"
                            />
                            <span>Include Main Activity Box</span>
                          </label>
                          {includeMainActivity && (
                            <textarea
                              value={mainActivityContent}
                              onChange={(e) => setMainActivityContent(e.target.value)}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                              placeholder="Enter main activity content"
                              rows={4}
                            />
                          )}
                        </div>

                        {/* Leaderboard */}
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-white">
                            <input
                              type="checkbox"
                              checked={includeLeaderboard}
                              onChange={(e) => setIncludeLeaderboard(e.target.checked)}
                              className="rounded"
                            />
                            <span>Include Leaderboard</span>
                          </label>
                          {includeLeaderboard && (
                            <textarea
                              value={leaderboardContent}
                              onChange={(e) => setLeaderboardContent(e.target.value)}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                              placeholder="Enter leaderboard content (one entry per line)"
                              rows={4}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleCreate}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    isLoading
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          )}

          {/* View/Delete Content */}
          {showViewDelete && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              {renderContentList()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 