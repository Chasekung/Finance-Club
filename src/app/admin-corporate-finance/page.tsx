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
  includeTitle: boolean;
  includeInstructions: boolean;
  includeTeams: boolean;
  includeMainActivity: boolean;
  includeLeaderboard: boolean;
  titleContent: string;
  instructionsContent: string;
  teamsContent: string;
  mainActivityContent: string;
  leaderboardContent: string;
}

interface GroupedContent {
  [section: string]: ContentItem[];
}

interface ApiResponse {
  fixedSections: string[];
  content: GroupedContent;
}

interface Team {
  name: string;
  members: string;
}

interface LeaderboardEntry {
  teamName: string;
  score: number;
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

  const [teams, setTeams] = useState<Team[]>([{ name: '', members: '' }]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [editingLeaderboard, setEditingLeaderboard] = useState<boolean>(false);

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
      // Filter out empty teams
      const validTeams = teams.filter(team => team.name.trim() !== '');
      
      // Create initial leaderboard entries
      const initialLeaderboard = validTeams.map(team => ({
        teamName: team.name,
        score: 0
      }));

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
          teamsContent: JSON.stringify(validTeams),
          mainActivityContent,
          leaderboardContent: JSON.stringify(initialLeaderboard),
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
      setMainActivityContent('');
      setTeams([{ name: '', members: '' }]);
      setLeaderboard([]);
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
    try {
      // Always parse teams if they exist
      if (item.includeTeams && item.teamsContent) {
        const parsedTeams = JSON.parse(item.teamsContent);
        setTeams(parsedTeams.length > 0 ? parsedTeams : [{ name: '', members: '' }]);
      } else {
        setTeams([{ name: '', members: '' }]);
      }

      // Always parse leaderboard if it exists
      if (item.includeLeaderboard && item.leaderboardContent) {
        const parsedLeaderboard = JSON.parse(item.leaderboardContent);
        setLeaderboard(parsedLeaderboard);
      } else {
        setLeaderboard([]);
      }

      // Set editing state for leaderboard
      setEditingLeaderboard(item.includeLeaderboard);
    } catch (e) {
      console.error('Error parsing teams or leaderboard data:', e);
      setTeams([{ name: '', members: '' }]);
      setLeaderboard([]);
    }
  };

  const handleUpdate = async (updatedItem: ContentItem) => {
    try {
      // Filter out empty teams
      const validTeams = teams.filter(team => team.name.trim() !== '');
      
      // Create updated leaderboard entries based on valid teams
      const updatedLeaderboard = validTeams.map(team => {
        const existingEntry = leaderboard.find(entry => entry.teamName === team.name);
        return {
          teamName: team.name,
          score: existingEntry?.score || 0
        };
      });

      const response = await fetch(`/api/corporate-finance/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedItem,
          teamsContent: JSON.stringify(validTeams),
          leaderboardContent: JSON.stringify(updatedLeaderboard),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
      setEditingItem(null);
      setEditingLeaderboard(false);
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleTeamChange = (index: number, field: 'name' | 'members', value: string) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], [field]: value };
    setTeams(newTeams);
    
    // Update leaderboard when team names change
    if (field === 'name' && includeLeaderboard) {
      const newLeaderboard = newTeams.map(team => ({
        teamName: team.name,
        score: leaderboard.find(entry => entry.teamName === team.name)?.score || 0
      }));
      setLeaderboard(newLeaderboard);
    }
  };

  const handleAddTeamRow = () => {
    setTeams([...teams, { name: '', members: '' }]);
  };

  const handleRemoveTeamRow = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    
    // Update leaderboard when removing a team
    if (includeLeaderboard) {
      const newLeaderboard = newTeams.map(team => ({
        teamName: team.name,
        score: leaderboard.find(entry => entry.teamName === team.name)?.score || 0
      }));
      setLeaderboard(newLeaderboard);
    }
  };

  const handleLeaderboardScoreChange = (index: number, score: number) => {
    const newLeaderboard = [...leaderboard];
    newLeaderboard[index].score = score;
    setLeaderboard(newLeaderboard);
  };

  const handleUpdateLeaderboard = async () => {
    try {
      const response = await fetch(`/api/corporate-finance/${editingItem?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingItem,
          leaderboardContent: JSON.stringify(leaderboard),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update leaderboard');
      }
      setEditingLeaderboard(false);
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

    const renderTeamsData = (teamsContent: string) => {
      try {
        const teams = JSON.parse(teamsContent);
        if (!Array.isArray(teams) || teams.length === 0) return null;
        
        return (
          <div className="mt-4 bg-white/5 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-2">Teams</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 px-4 text-white">Team Name</th>
                    <th className="text-left py-2 px-4 text-white">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team: Team, index: number) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-2 px-4 text-white">{team.name}</td>
                      <td className="py-2 px-4 text-white">{team.members}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } catch (e) {
        console.error('Error rendering teams data:', e);
        return null;
      }
    };

    const renderLeaderboardData = (leaderboardContent: string) => {
      try {
        const leaderboard = JSON.parse(leaderboardContent);
        if (!Array.isArray(leaderboard) || leaderboard.length === 0) return null;

        return (
          <div className="mt-4 bg-white/5 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-2">Leaderboard</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 px-4 text-white">Team Name</th>
                    <th className="text-left py-2 px-4 text-white">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry: LeaderboardEntry, index: number) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-2 px-4 text-white">{entry.teamName}</td>
                      <td className="py-2 px-4 text-white">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } catch (e) {
        console.error('Error rendering leaderboard data:', e);
        return null;
      }
    };

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
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white">{item.itemName}</h3>
                  <p className="text-white/70">
                    Section: {item.section} | Type: {item.linkType}
                  </p>
                  {item.includeTitle && (
                    <div className="mt-2">
                      <h4 className="text-lg font-medium text-white">Title</h4>
                      <p className="text-white/90 bg-white/5 rounded-lg p-3">{item.titleContent}</p>
                    </div>
                  )}
                  {item.includeInstructions && (
                    <div className="mt-2">
                      <h4 className="text-lg font-medium text-white">Instructions</h4>
                      <p className="text-white/90 bg-white/5 rounded-lg p-3">{item.instructionsContent}</p>
                    </div>
                  )}
                  {item.includeMainActivity && (
                    <div className="mt-2">
                      <h4 className="text-lg font-medium text-white">Main Activity</h4>
                      <p className="text-white/90 bg-white/5 rounded-lg p-3">{item.mainActivityContent}</p>
                    </div>
                  )}
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

              {item.includeTeams && renderTeamsData(item.teamsContent)}
              {item.includeLeaderboard && !editingLeaderboard && renderLeaderboardData(item.leaderboardContent)}
              
              {editingItem?.id === item.id && editingLeaderboard && (
                <div className="mt-4 bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">Update Leaderboard</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 px-4 text-white">Team Name</th>
                          <th className="text-left py-2 px-4 text-white">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, index) => (
                          <tr key={index} className="border-b border-white/10">
                            <td className="py-2 px-4 text-white">{entry.teamName}</td>
                            <td className="py-2 px-4">
                              <input
                                type="number"
                                value={entry.score}
                                onChange={(e) => handleLeaderboardScoreChange(index, parseInt(e.target.value) || 0)}
                                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleUpdateLeaderboard}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Update Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTeamsTable = () => (
    <div className="mt-4">
      <div className="overflow-x-auto bg-white/5 rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2 text-white">Team Name</th>
              <th className="text-left p-2 text-white">Team Members (comma-separated)</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className="border-t border-white/10">
                <td className="p-2">
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                    placeholder="Team Name"
                    className="w-full bg-white/10 text-white p-2 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={team.members}
                    onChange={(e) => handleTeamChange(index, 'members', e.target.value)}
                    placeholder="Member1, Member2, ..."
                    className="w-full bg-white/10 text-white p-2 rounded"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleRemoveTeamRow(index)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddTeamRow}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Team
        </button>
      </div>
    </div>
  );

  const renderLeaderboardTable = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-white">Team Name</th>
              <th className="text-left py-3 px-4 text-white">Score</th>
            </tr>
          </thead>
          <tbody>
            {teams.filter(team => team.name.trim() !== '').map((team, index) => (
              <tr key={index} className="border-b border-white/10">
                <td className="py-3 px-4 text-white">{team.name}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={leaderboard[index]?.score || 0}
                    onChange={(e) => handleLeaderboardScoreChange(index, parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Enter score"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                          {includeTeams && renderTeamsTable()}
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
                          {includeLeaderboard && renderLeaderboardTable()}
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