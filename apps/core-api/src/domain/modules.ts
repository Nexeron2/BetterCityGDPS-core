export type CoreDomainModuleId =
  | "accounts"
  | "players"
  | "levels"
  | "comments"
  | "messages"
  | "relationships"
  | "scores"
  | "songs"
  | "rewards"
  | "lists"
  | "moderation";

export type CoreDomainModule = {
  id: CoreDomainModuleId;
  label: string;
  description: string;
  endpointGroups: string[];
};

export const coreDomainModules: CoreDomainModule[] = [
  {
    id: "accounts",
    label: "Accounts",
    description: "Legacy account registration, login, sync, and backup flows.",
    endpointGroups: ["accounts", "account-management"]
  },
  {
    id: "players",
    label: "Players",
    description: "Player profile, account settings, and search-oriented user data.",
    endpointGroups: ["profiles", "user-settings"]
  },
  {
    id: "levels",
    label: "Levels",
    description: "Level browse, upload, download, rating, and platform compatibility routes.",
    endpointGroups: ["level-browse", "level-write", "level-rating"]
  },
  {
    id: "comments",
    label: "Comments",
    description: "Level comments, account comments, replies, and moderation actions.",
    endpointGroups: ["comments", "comment-moderation"]
  },
  {
    id: "messages",
    label: "Messages",
    description: "Private messages, downloads, inbox state, and deletions.",
    endpointGroups: ["messages"]
  },
  {
    id: "relationships",
    label: "Relationships",
    description: "Friends, friend requests, block lists, and account relationships.",
    endpointGroups: ["friends", "blocks"]
  },
  {
    id: "scores",
    label: "Scores",
    description: "User score updates, leaderboards, creators, and level records.",
    endpointGroups: ["leaderboards", "score-updates"]
  },
  {
    id: "songs",
    label: "Songs",
    description: "Song metadata, top artists, and reupload-related compatibility routes.",
    endpointGroups: ["songs", "artists"]
  },
  {
    id: "rewards",
    label: "Rewards",
    description: "Daily rewards, quests, secret rewards, and reward-oriented endpoints.",
    endpointGroups: ["daily", "quests", "rewards"]
  },
  {
    id: "lists",
    label: "Lists",
    description: "Map packs, gauntlets, and list-oriented content endpoints.",
    endpointGroups: ["map-packs", "gauntlets", "level-lists"]
  },
  {
    id: "moderation",
    label: "Moderation",
    description: "Reports, suggestions, bans, likes, and moderation-facing compatibility.",
    endpointGroups: ["reports", "suggestions", "likes"]
  }
];