export type StoredAccount = {
  accountId: number;
  userName: string;
  passwordHash: string;
  gjp2: string;
  email: string;
  registerDate: number;
  isActive: boolean;
  friendsState: number;
  messagesState: number;
  commentsState: number;
  youtubeUrl: string;
  twitter: string;
  twitch: string;
  instagram: string;
  tiktok: string;
  discord: string;
  custom: string;
};

export type StoredUser = {
  userId: number;
  extId: number;
  userName: string;
  stars: number;
  demons: number;
  coins: number;
  userCoins: number;
  diamonds: number;
  moons: number;
  creatorPoints: number;
  color1: number;
  color2: number;
  color3: number;
  accIcon: number;
  accShip: number;
  accBall: number;
  accBird: number;
  accDart: number;
  accRobot: number;
  accGlow: number;
  accSpider: number;
  accExplosion: number;
  accSwing: number;
  accJetpack: number;
  dinfo: string;
  sinfo: string;
  pinfo: string;
  lastPlayed: number;
  chest1Time: number;
  chest1Count: number;
  chest2Time: number;
  chest2Count: number;
};

export type StoredSong = {
  songId: number;
  name: string;
  authorId: number;
  authorName: string;
  size: string;
  download: string;
  isDisabled: number;
};

export type StoredLevel = {
  levelId: number;
  name: string;
  description: string;
  version: number;
  userId: number;
  extId: number;
  userName: string;
  gameVersion: number;
  binaryVersion: number;
  audioTrack: number;
  songId: number;
  songIds: string;
  sfxIds: string;
  length: number;
  downloads: number;
  likes: number;
  stars: number;
  featured: number;
  epic: number;
  objects: number;
  coins: number;
  verifiedCoins: number;
  requestedStars: number;
  difficulty: number;
  demon: number;
  demonDiff: number;
  auto: number;
  original: number;
  twoPlayer: number;
  extraString: string;
  levelInfo: string;
  password: number;
  levelString: string;
  settingsString: string;
  isLdm: number;
  wt: number;
  wt2: number;
  ts: number;
  uploadDate: number;
  updateDate: number;
  unlisted: number;
};

export type StoredComment = {
  commentId: number;
  levelId: number;
  userId: number;
  userName: string;
  comment: string;
  percent: number;
  likes: number;
  isSpam: number;
  timestamp: number;
};

export type StoredAccountComment = {
  accountCommentId: number;
  userId: number;
  userName: string;
  comment: string;
  likes: number;
  isSpam: number;
  timestamp: number;
};

export type StoredLevelScore = {
  levelScoreId: number;
  accountId: number;
  levelId: number;
  percent: number;
  coins: number;
  timestamp: number;
};

export type StoredMessage = {
  messageId: number;
  accountId: number;
  toAccountId: number;
  subject: string;
  body: string;
  isNew: number;
  timestamp: number;
  readTime: number;
};

export type StoredFriendRequest = {
  requestId: number;
  accountId: number;
  toAccountId: number;
  comment: string;
  isNew: number;
  timestamp: number;
};

export type StoredFriendship = {
  friendshipId: number;
  person1: number;
  person2: number;
  isNew1: number;
  isNew2: number;
};

export type StoredBlock = {
  blockId: number;
  person1: number;
  person2: number;
};

export type StoredDailyFeature = {
  featureId: number;
  type: 0 | 1 | 2;
  levelId: number;
  timestamp: number;
  duration: number;
  rewards: string;
};

export type StoredQuestTemplate = {
  questTemplateId: number;
  type: number;
  amount: number;
  reward: number;
  name: string;
};

export type StoredMapPack = {
  mapPackId: number;
  name: string;
  levelIds: number[];
  stars: number;
  coins: number;
  difficulty: number;
  rgbColors: string;
  colors2: string;
};

export type StoredGauntlet = {
  gauntletId: number;
  levelIds: number[];
};

export type StoredVaultCode = {
  rewardId: number;
  code: string;
  rewards: string;
  duration: number;
  uses: number;
  timestamp: number;
};

export type StoredVaultClaim = {
  accountId: number;
  rewardId: number;
};

export type StoredAccountSave = {
  accountId: number;
  saveData: string;
  updatedAt: number;
};

export type StoredItemLike = {
  itemId: number;
  type: number;
  isLike: number;
  ip: string;
  timestamp: number;
};

export type StoredLevelReport = {
  reportId: number;
  levelId: number;
  ip: string;
  timestamp: number;
};

export type StoredLevelList = {
  listId: number;
  listName: string;
  listDesc: string;
  listVersion: number;
  accountId: number;
  userId: number;
  userName: string;
  downloads: number;
  likes: number;
  starDifficulty: number;
  starFeatured: number;
  starStars: number;
  countForReward: number;
  levelIds: number[];
  uploadDate: number;
  updateDate: number;
};

export type CoreDataFile = {
  nextAccountId: number;
  nextUserId: number;
  nextLevelId: number;
  nextCommentId: number;
  nextAccountCommentId: number;
  nextSongId: number;
  nextLevelScoreId: number;
  nextMessageId: number;
  nextFriendRequestId: number;
  nextFriendshipId: number;
  nextBlockId: number;
  nextReportId: number;
  accounts: StoredAccount[];
  users: StoredUser[];
  songs: StoredSong[];
  levels: StoredLevel[];
  comments: StoredComment[];
  accountComments: StoredAccountComment[];
  levelScores: StoredLevelScore[];
  messages: StoredMessage[];
  friendRequests: StoredFriendRequest[];
  friendships: StoredFriendship[];
  blocks: StoredBlock[];
  dailyFeatures: StoredDailyFeature[];
  quests: StoredQuestTemplate[];
  vaultCodes: StoredVaultCode[];
  vaultClaims: StoredVaultClaim[];
  saves: StoredAccountSave[];
  itemLikes: StoredItemLike[];
  levelReports: StoredLevelReport[];
  mapPacks: StoredMapPack[];
  gauntlets: StoredGauntlet[];
  levelLists: StoredLevelList[];
};





