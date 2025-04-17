export interface CorporateFinanceContent {
  id: string;
  section: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
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