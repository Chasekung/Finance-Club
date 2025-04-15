
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

export default function CorporateFinancePage() {
  const [content, setContent] = useState<TemplateContent>({
    title: "Accounting Workshop - 4/15/25",
    instructions: "You will be given a piece of paper containing a business idea. In groups of 2-4, find Journal Entries, Cash flow statements, Income statements, and Balance Sheets.",
    teams: [{"name":"Team 1","members":"N/A"},{"name":"Team 2","members":"N/A"},{"name":"Team 3","members":"N/A"},{"name":"Team 4","members":"N/A"}],
    mainActivity: "If you forgot how to find all four things, then just go to Bell Finance OneNote page to see, and also go to Files --> Meeting Slideshows --> Meeting #6 (Accounting) slideshow to remember how to solve things 4 things.",
    leaderboard: [{"teamName":"Team 1","score":0},{"teamName":"Team 2","score":0},{"teamName":"Team 3","score":0},{"teamName":"Team 4","score":0}]
  });

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

        
        {/* Title Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Title</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">Accounting Workshop - 4/15/25</p>
          </div>
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
                  <th className="text-right py-3 px-4 text-white">Score</th>
                </tr>
              </thead>
              <tbody>
                {content.leaderboard
                  .sort((a, b) => b.score - a.score)
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
        
      </div>
    </div>
  );
}
