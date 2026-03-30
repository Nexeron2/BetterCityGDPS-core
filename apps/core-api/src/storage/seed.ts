import { gjp2FromPassword, hashPassword } from "../utils/crypto";
import type { CoreDataFile } from "./types";

const seededPassword = "citybot-demo";
const now = Math.floor(Date.now() / 1000);
const day = 86400;

export const defaultCoreData: CoreDataFile = {
  nextAccountId: 2,
  nextUserId: 2,
  nextLevelId: 2,
  nextCommentId: 1,
  nextAccountCommentId: 1,
  nextSongId: 3,
  nextLevelScoreId: 1,
  nextMessageId: 1,
  nextFriendRequestId: 1,
  nextFriendshipId: 1,
  nextBlockId: 1,
  nextReportId: 1,
  accounts: [
    {
      accountId: 1,
      userName: "CityBot",
      passwordHash: hashPassword(seededPassword),
      gjp2: gjp2FromPassword(seededPassword),
      email: "citybot@local.test",
      registerDate: 1700000000,
      isActive: true,
      friendsState: 0,
      messagesState: 0,
      commentsState: 0,
      youtubeUrl: "",
      twitter: "",
      twitch: "",
      instagram: "",
      tiktok: "",
      discord: "",
      custom: ""
    }
  ],
  users: [
    {
      userId: 1,
      extId: 1,
      userName: "CityBot",
      stars: 100,
      demons: 5,
      coins: 25,
      userCoins: 15,
      diamonds: 50,
      moons: 10,
      creatorPoints: 3,
      color1: 1,
      color2: 2,
      color3: 0,
      accIcon: 1,
      accShip: 2,
      accBall: 3,
      accBird: 4,
      accDart: 5,
      accRobot: 6,
      accGlow: 1,
      accSpider: 7,
      accExplosion: 2,
      accSwing: 1,
      accJetpack: 1,
      dinfo: "",
      sinfo: "",
      pinfo: "",
      lastPlayed: 1700000000,
      chest1Time: 0,
      chest1Count: 0,
      chest2Time: 0,
      chest2Count: 0
    }
  ],
  songs: [
    {
      songId: 1,
      name: "Better City Theme",
      authorId: 1234,
      authorName: "CityBot",
      size: "6.69",
      download: "https://example.com/audio/citybot-theme.mp3",
      isDisabled: 0
    },
    {
      songId: 2,
      name: "Metro Skyline",
      authorId: 5678,
      authorName: "Neon Avenue",
      size: "7.20",
      download: "https://example.com/audio/metro-skyline.mp3",
      isDisabled: 0
    }
  ],
  levels: [
    {
      levelId: 1,
      name: "Welcome Test",
      description: "Better City GDPS Core test level",
      version: 1,
      userId: 1,
      extId: 1,
      userName: "CityBot",
      gameVersion: 22,
      binaryVersion: 39,
      audioTrack: 1,
      songId: 1,
      songIds: "",
      sfxIds: "",
      length: 0,
      downloads: 300,
      likes: 100,
      stars: 1,
      featured: 0,
      epic: 0,
      objects: 1,
      coins: 0,
      verifiedCoins: 0,
      requestedStars: 1,
      difficulty: 10,
      demon: 0,
      demonDiff: 0,
      auto: 0,
      original: 0,
      twoPlayer: 0,
      extraString: "",
      levelInfo: "",
      password: 0,
      levelString: "kS38,1_1_2_1_3_0_6_1_7_1_8_1_41_1_4_0_5_0_10_0_11_0_12_0_13_0_14_0_15_0_16_0_18_0_19_0_20_0_21_0_22_0_23_0_24_0_25_0_26_0_28_0_29_0_31_0_32_0_35_0_36_0_38_0_39_0_40_0;",
      settingsString: "",
      isLdm: 0,
      wt: 0,
      wt2: 0,
      ts: 0,
      uploadDate: 1700000000,
      updateDate: 1700000000,
      unlisted: 0
    }
  ],
  comments: [],
  accountComments: [],
  levelScores: [],
  messages: [],
  friendRequests: [],
  friendships: [],
  blocks: [],
  dailyFeatures: [
    {
      featureId: 1,
      type: 0,
      levelId: 1,
      timestamp: now - 3600,
      duration: now + day,
      rewards: "orbs,200,diamonds,10"
    },
    {
      featureId: 2,
      type: 1,
      levelId: 1,
      timestamp: now - 3600,
      duration: now + (7 * day),
      rewards: "orbs,500,diamonds,20"
    },
    {
      featureId: 3,
      type: 2,
      levelId: 1,
      timestamp: now - 3600,
      duration: now + (2 * day),
      rewards: "orbs,300,keys,2"
    }
  ],
  quests: [
    { questTemplateId: 1, type: 1, amount: 5, reward: 10, name: "Collect stars" },
    { questTemplateId: 2, type: 2, amount: 3, reward: 15, name: "Grab user coins" },
    { questTemplateId: 3, type: 3, amount: 1, reward: 20, name: "Beat a demon" },
    { questTemplateId: 4, type: 4, amount: 10, reward: 25, name: "Like levels" },
    { questTemplateId: 5, type: 5, amount: 2, reward: 30, name: "Finish dailies" }
  ],
  vaultCodes: [
    { rewardId: 1, code: Buffer.from('CITYSECRET').toString('base64'), rewards: '1,100,2,10', duration: 0, uses: 5, timestamp: now }
  ],
  vaultClaims: [],
  saves: [],
  itemLikes: [],
  levelReports: [],
  mapPacks: [
    {
      mapPackId: 1,
      name: "Starter Pack",
      levelIds: [1],
      stars: 3,
      coins: 0,
      difficulty: 1,
      rgbColors: "255,128,0",
      colors2: "255,196,64"
    }
  ],
  gauntlets: [
    {
      gauntletId: 1,
      levelIds: [1, 1, 1, 1, 1]
    }
  ],
  levelLists: [
    {
      listId: 1,
      listName: "Starter Showcase",
      listDesc: "First Better City GDPS list",
      listVersion: 1,
      accountId: 1,
      userId: 1,
      userName: "CityBot",
      downloads: 42,
      likes: 15,
      starDifficulty: 1,
      starFeatured: 1,
      starStars: 3,
      countForReward: 1,
      levelIds: [1],
      uploadDate: now - day,
      updateDate: now - 1800
    }
  ]
};






