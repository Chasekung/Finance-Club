'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CorporateFinanceContent } from '@/types';
import { getCorporateFinanceContent } from '@/services/api/corporateFinance';

interface Team {
  name: string;
  members: string;
}

interface LeaderboardEntry {
  teamName: string;
  score: number;
}

interface CorporateFinanceClientProps {
  id: string;
}

export default function CorporateFinanceClient({ id }: CorporateFinanceClientProps) {
  const [content, setContent] = useState<CorporateFinanceContent | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getCorporateFinanceContent(id);
        setContent(data);

        // Parse teams data
        if (data.includeTeams && data.teamsContent) {
          try {
            let parsedTeams;
            if (typeof data.teamsContent === 'string') {
              parsedTeams = JSON.parse(data.teamsContent);
            } else {
              parsedTeams = data.teamsContent;
            }
            if (Array.isArray(parsedTeams)) {
              setTeams(parsedTeams);
            }
          } catch (e) {
            console.error('Error parsing teams data:', e);
            setTeams([]);
          }
        }

        // Parse leaderboard data
        if (data.includeLeaderboard && data.leaderboardContent) {
          try {
            let parsedLeaderboard;
            if (typeof data.leaderboardContent === 'string') {
              parsedLeaderboard = JSON.parse(data.leaderboardContent);
            } else {
              parsedLeaderboard = data.leaderboardContent;
            }
            if (Array.isArray(parsedLeaderboard)) {
              setLeaderboard(parsedLeaderboard);
            }
          } catch (e) {
            console.error('Error parsing leaderboard data:', e);
            setLeaderboard([]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-400 text-center">{error || 'Content not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{content.itemName}</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Title Box */}
        {content.includeTitle && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Title</h2>
            <div className="prose prose-invert">
              <p className="text-white/90 whitespace-pre-line">{content.titleContent}</p>
            </div>
          </div>
        )}

        {/* Instructions Box */}
        {content.includeInstructions && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Instructions</h2>
            <div className="prose prose-invert">
              <p className="text-white/90 whitespace-pre-line">{content.instructionsContent}</p>
            </div>
          </div>
        )}

        {/* Teams Table */}
        {content.includeTeams && teams.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Teams</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white">Team Name</th>
                    <th className="text-left py-3 px-4 text-white">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white">{team.name}</td>
                      <td className="py-3 px-4 text-white">{team.members}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Main Activity Box */}
        {content.includeMainActivity && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Main Activity</h2>
            <div className="prose prose-invert">
              <p className="text-white/90 whitespace-pre-line">{content.mainActivityContent}</p>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {content.includeLeaderboard && leaderboard.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white">Team Name</th>
                    <th className="text-right py-3 px-4 text-white">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard
                    .sort((a, b) => b.score - a.score) // Sort by score in descending order
                    .map((entry, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white">{entry.teamName}</td>
                      <td className="py-3 px-4 text-white text-right">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 