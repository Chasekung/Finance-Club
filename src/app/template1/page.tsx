'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Team {
  name: string;
  members: string;
}

interface LeaderboardEntry {
  teamName: string;
  score: number;
}

interface TemplateContent {
  title: string;
  instructions: string;
  teams: Team[];
  mainActivity: string;
  leaderboard: LeaderboardEntry[];
}

export default function Template1() {
  const [content, setContent] = useState<TemplateContent>({
    title: "Sample Corporate Finance Challenge",
    instructions: "This is a sample set of instructions for the challenge. It should include all the necessary steps and guidelines for participants to follow.",
    teams: [],
    mainActivity: "This is the main activity description. It should detail what participants need to do and any specific requirements or constraints.",
    leaderboard: []
  });

  useEffect(() => {
    // Here you would fetch the actual content from your API
    // For now using sample data
    const fetchContent = async () => {
      try {
        // Simulating API call
        const teamsData = JSON.parse('[{"name":"Team Alpha","members":"John, Alice, Bob"},{"name":"Team Beta","members":"Carol, Dave, Eve"}]');
        const leaderboardData = JSON.parse('[{"teamName":"Team Alpha","score":100},{"teamName":"Team Beta","score":85}]');
        
        setContent(prev => ({
          ...prev,
          teams: teamsData,
          leaderboard: leaderboardData
        }));
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{content.title}</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Instructions Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Instructions</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">{content.instructions}</p>
          </div>
        </div>

        {/* Teams Table */}
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
                {content.teams.map((team, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">{team.name}</td>
                    <td className="py-3 px-4 text-white">{team.members}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Activity Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Main Activity</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">{content.mainActivity}</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white">Team Name</th>
                  <th className="text-left py-3 px-4 text-white">Score</th>
                </tr>
              </thead>
              <tbody>
                {content.leaderboard.map((entry, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">{entry.teamName}</td>
                    <td className="py-3 px-4 text-white">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 