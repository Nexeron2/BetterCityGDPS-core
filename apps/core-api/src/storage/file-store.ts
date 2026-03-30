import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defaultCoreData } from "./seed";
import type {
  CoreDataFile,
  StoredAccount,
  StoredAccountSave,
  StoredAccountComment,
  StoredBlock,
  StoredItemLike,
  StoredLevelReport,
  StoredDailyFeature,
  StoredGauntlet,
  StoredLevelList,
  StoredMapPack,
  StoredQuestTemplate,
  StoredVaultClaim,
  StoredVaultCode,
  StoredComment,
  StoredFriendRequest,
  StoredFriendship,
  StoredLevel,
  StoredLevelScore,
  StoredMessage,
  StoredSong,
  StoredUser
} from "./types";

export class FileCoreStore {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = resolve(filePath);
    this.ensure();
  }

  private ensure(): void {
    if (existsSync(this.filePath)) return;

    mkdirSync(dirname(this.filePath), { recursive: true });
    this.write(defaultCoreData);
  }

  private normalize(data: CoreDataFile): CoreDataFile {
    const songs = data.songs.length > 0 ? data.songs : [...defaultCoreData.songs];
    const users = data.users.map((user) => ({
      ...user,
      chest1Time: user.chest1Time ?? 0,
      chest1Count: user.chest1Count ?? 0,
      chest2Time: user.chest2Time ?? 0,
      chest2Count: user.chest2Count ?? 0
    }));
    const nextSongId = Math.max(
      data.nextSongId,
      songs.reduce((maxSongId, song) => Math.max(maxSongId, song.songId + 1), 1)
    );

    return {
      ...data,
      users,
      songs,
      dailyFeatures: data.dailyFeatures.length > 0 ? data.dailyFeatures : [...defaultCoreData.dailyFeatures],
      quests: data.quests.length > 0 ? data.quests : [...defaultCoreData.quests],
      vaultCodes: data.vaultCodes.length > 0 ? data.vaultCodes : [...defaultCoreData.vaultCodes],
      vaultClaims: data.vaultClaims.length > 0 ? data.vaultClaims : [...defaultCoreData.vaultClaims],
      mapPacks: data.mapPacks.length > 0 ? data.mapPacks : [...defaultCoreData.mapPacks],
      gauntlets: data.gauntlets.length > 0 ? data.gauntlets : [...defaultCoreData.gauntlets],
      levelLists: data.levelLists.length > 0 ? data.levelLists : [...defaultCoreData.levelLists],
      nextSongId
    };
  }

  private read(): CoreDataFile {
    const raw = JSON.parse(readFileSync(this.filePath, "utf8")) as Partial<CoreDataFile>;

    const data = this.normalize({
      nextAccountId: raw.nextAccountId ?? defaultCoreData.nextAccountId,
      nextUserId: raw.nextUserId ?? defaultCoreData.nextUserId,
      nextLevelId: raw.nextLevelId ?? defaultCoreData.nextLevelId,
      nextCommentId: raw.nextCommentId ?? defaultCoreData.nextCommentId,
      nextAccountCommentId: raw.nextAccountCommentId ?? 1,
      nextSongId: raw.nextSongId ?? 1,
      nextLevelScoreId: raw.nextLevelScoreId ?? 1,
      nextMessageId: raw.nextMessageId ?? 1,
      nextFriendRequestId: raw.nextFriendRequestId ?? 1,
      nextFriendshipId: raw.nextFriendshipId ?? 1,
      nextBlockId: raw.nextBlockId ?? 1,
      nextReportId: raw.nextReportId ?? 1,
      accounts: raw.accounts ?? [],
      users: raw.users ?? [],
      songs: raw.songs ?? [],
      levels: raw.levels ?? [],
      comments: raw.comments ?? [],
      accountComments: raw.accountComments ?? [],
      levelScores: raw.levelScores ?? [],
      messages: raw.messages ?? [],
      friendRequests: raw.friendRequests ?? [],
      friendships: raw.friendships ?? [],
      blocks: raw.blocks ?? [],
      dailyFeatures: raw.dailyFeatures ?? [],
      quests: raw.quests ?? [],
      vaultCodes: raw.vaultCodes ?? [],
      vaultClaims: raw.vaultClaims ?? [],
      saves: raw.saves ?? [],
      itemLikes: raw.itemLikes ?? [],
      levelReports: raw.levelReports ?? [],
      mapPacks: raw.mapPacks ?? [],
      gauntlets: raw.gauntlets ?? [],
      levelLists: raw.levelLists ?? []
    });

    if (
      (raw.songs?.length ?? 0) !== data.songs.length ||
      (raw.nextSongId ?? data.nextSongId) !== data.nextSongId ||
      (raw.dailyFeatures?.length ?? 0) !== data.dailyFeatures.length ||
      (raw.quests?.length ?? 0) !== data.quests.length ||
      (raw.vaultCodes?.length ?? 0) !== data.vaultCodes.length ||
      (raw.vaultClaims?.length ?? 0) !== data.vaultClaims.length ||
      (raw.mapPacks?.length ?? 0) !== data.mapPacks.length ||
      (raw.gauntlets?.length ?? 0) !== data.gauntlets.length ||
      (raw.levelLists?.length ?? 0) !== data.levelLists.length ||
      JSON.stringify(raw.users ?? []) !== JSON.stringify(data.users)
    ) {
      this.write(data);
    }

    return data;
  }

  private write(data: CoreDataFile): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  getSnapshot(): CoreDataFile {
    return this.read();
  }

  findAccountByUserName(userName: string): StoredAccount | undefined {
    return this.read().accounts.find((account) => account.userName.toLowerCase() === userName.toLowerCase());
  }

  findAccountById(accountId: number): StoredAccount | undefined {
    return this.read().accounts.find((account) => account.accountId === accountId);
  }

  findUserByExtId(extId: number): StoredUser | undefined {
    return this.read().users.find((user) => user.extId === extId);
  }

  findUserByUserId(userId: number): StoredUser | undefined {
    return this.read().users.find((user) => user.userId === userId);
  }

  findLevelById(levelId: number): StoredLevel | undefined {
    return this.read().levels.find((level) => level.levelId === levelId);
  }

  findSongById(songId: number): StoredSong | undefined {
    return this.read().songs.find((song) => song.songId === songId);
  }

  listTopSongs(page: number): { songs: StoredSong[]; total: number } {
    const songs = [...this.read().songs].filter((song) => song.isDisabled === 0);
    return {
      songs: songs.slice(page * 20, (page + 1) * 20),
      total: songs.length
    };
  }

  findLevelByNameForUser(userId: number, name: string): StoredLevel | undefined {
    return this.read().levels.find((level) => level.userId === userId && level.name === name);
  }

  listLevels(): StoredLevel[] {
    return [...this.read().levels].sort((a, b) => b.uploadDate - a.uploadDate);
  }

  listCommentsForLevel(levelId: number): StoredComment[] {
    return this.read().comments.filter((comment) => comment.levelId === levelId).sort((a, b) => b.commentId - a.commentId);
  }

  listAccountCommentsForUser(userId: number): StoredAccountComment[] {
    return this.read().accountComments.filter((comment) => comment.userId === userId).sort((a, b) => b.accountCommentId - a.accountCommentId);
  }

  createAccountComment(input: Omit<StoredAccountComment, "accountCommentId" | "likes" | "isSpam" | "timestamp">): StoredAccountComment {
    const data = this.read();
    const comment: StoredAccountComment = {
      accountCommentId: data.nextAccountCommentId++,
      likes: 0,
      isSpam: 0,
      timestamp: Math.floor(Date.now() / 1000),
      ...input
    };

    data.accountComments.push(comment);
    this.write(data);
    return comment;
  }

  deleteAccountComment(accountCommentId: number, userId: number): boolean {
    const data = this.read();
    const originalLength = data.accountComments.length;
    data.accountComments = data.accountComments.filter((comment) => !(comment.accountCommentId === accountCommentId && comment.userId === userId));
    const changed = data.accountComments.length !== originalLength;
    if (changed) this.write(data);
    return changed;
  }

  searchUsers(search: string, page: number): { users: StoredUser[]; total: number } {
    const normalized = search.toLowerCase();
    const users = this.read().users
      .filter((user) => String(user.userId) === search || user.userName.toLowerCase().includes(normalized))
      .sort((a, b) => b.stars - a.stars || a.userName.localeCompare(b.userName));

    return {
      users: users.slice(page * 10, (page + 1) * 10),
      total: users.length
    };
  }

  listUsersSortedBy(stat: "stars" | "moons" | "demons" | "userCoins" | "creatorPoints", accountIds?: number[]): StoredUser[] {
    const users = [...this.read().users].filter((user) => !accountIds || accountIds.includes(user.extId));
    return users.sort((a, b) => b[stat] - a[stat] || a.userName.localeCompare(b.userName));
  }

  upsertLevelScore(accountId: number, levelId: number, percent: number, coins: number): StoredLevelScore {
    const data = this.read();
    const existingIndex = data.levelScores.findIndex((score) => score.accountId === accountId && score.levelId === levelId);
    const timestamp = Math.floor(Date.now() / 1000);

    if (existingIndex !== -1) {
      if (data.levelScores[existingIndex].percent <= percent) {
        data.levelScores[existingIndex] = { ...data.levelScores[existingIndex], percent, coins, timestamp };
        this.write(data);
      }
      return data.levelScores[existingIndex];
    }

    const score: StoredLevelScore = {
      levelScoreId: data.nextLevelScoreId++,
      accountId,
      levelId,
      percent,
      coins,
      timestamp
    };
    data.levelScores.push(score);
    this.write(data);
    return score;
  }

  listLevelScores(levelId: number, accountIds?: number[]): StoredLevelScore[] {
    return this.read().levelScores
      .filter((score) => score.levelId === levelId && (!accountIds || accountIds.includes(score.accountId)))
      .sort((a, b) => b.percent - a.percent || b.timestamp - a.timestamp);
  }

  createAccount(account: Omit<StoredAccount, "accountId">, user: Omit<StoredUser, "userId" | "extId">): { account: StoredAccount; user: StoredUser } {
    const data = this.read();
    const nextAccountId = data.nextAccountId++;
    const nextUserId = data.nextUserId++;

    const createdAccount: StoredAccount = { accountId: nextAccountId, ...account };
    const createdUser: StoredUser = { userId: nextUserId, extId: nextAccountId, ...user };

    data.accounts.push(createdAccount);
    data.users.push(createdUser);
    this.write(data);

    return { account: createdAccount, user: createdUser };
  }

  updateUser(userId: number, updater: (user: StoredUser) => StoredUser): StoredUser | null {
    const data = this.read();
    const index = data.users.findIndex((user) => user.userId === userId);
    if (index === -1) return null;

    data.users[index] = updater(data.users[index]);
    this.write(data);
    return data.users[index];
  }

  updateAccount(accountId: number, updater: (account: StoredAccount) => StoredAccount): StoredAccount | null {
    const data = this.read();
    const index = data.accounts.findIndex((account) => account.accountId === accountId);
    if (index === -1) return null;

    data.accounts[index] = updater(data.accounts[index]);
    this.write(data);
    return data.accounts[index];
  }

  createOrUpdateLevel(input: Omit<StoredLevel, "levelId" | "uploadDate" | "updateDate">, existingLevelId?: number): StoredLevel {
    const data = this.read();
    const timestamp = Math.floor(Date.now() / 1000);

    if (existingLevelId) {
      const index = data.levels.findIndex((level) => level.levelId === existingLevelId);
      if (index !== -1) {
        data.levels[index] = {
          ...data.levels[index],
          ...input,
          levelId: existingLevelId,
          updateDate: timestamp
        };
        this.write(data);
        return data.levels[index];
      }
    }

    const level: StoredLevel = {
      levelId: data.nextLevelId++,
      uploadDate: timestamp,
      updateDate: timestamp,
      ...input
    };

    data.levels.push(level);
    this.write(data);
    return level;
  }

  createComment(comment: Omit<StoredComment, "commentId" | "timestamp" | "likes" | "isSpam">): StoredComment {
    const data = this.read();
    const created: StoredComment = {
      commentId: data.nextCommentId++,
      timestamp: Math.floor(Date.now() / 1000),
      likes: 0,
      isSpam: 0,
      ...comment
    };

    data.comments.push(created);
    this.write(data);
    return created;
  }

  deleteComment(commentId: number, userId: number): boolean {
    const data = this.read();
    const originalLength = data.comments.length;
    data.comments = data.comments.filter((comment) => !(comment.commentId === commentId && comment.userId === userId));
    const changed = data.comments.length !== originalLength;
    if (changed) this.write(data);
    return changed;
  }

  listMessagesForAccount(accountId: number, sent: boolean): StoredMessage[] {
    const data = this.read();
    return [...data.messages]
      .filter((message) => sent ? message.accountId === accountId : message.toAccountId === accountId)
      .sort((a, b) => b.messageId - a.messageId);
  }

  findMessageForAccount(messageId: number, accountId: number): StoredMessage | undefined {
    return this.read().messages.find((message) => message.messageId === messageId && (message.accountId === accountId || message.toAccountId === accountId));
  }

  createMessage(input: Omit<StoredMessage, "messageId" | "timestamp" | "isNew" | "readTime">): StoredMessage {
    const data = this.read();
    const message: StoredMessage = {
      messageId: data.nextMessageId++,
      timestamp: Math.floor(Date.now() / 1000),
      isNew: 0,
      readTime: 0,
      ...input
    };

    data.messages.push(message);
    this.write(data);
    return message;
  }

  markMessageRead(messageId: number, accountId: number): StoredMessage | null {
    const data = this.read();
    const index = data.messages.findIndex((message) => message.messageId === messageId && message.toAccountId === accountId);
    if (index === -1) return null;

    if (data.messages[index].readTime === 0) {
      data.messages[index] = {
        ...data.messages[index],
        isNew: 1,
        readTime: Math.floor(Date.now() / 1000)
      };
      this.write(data);
    }

    return data.messages[index];
  }

  deleteMessage(messageId: number, accountId: number): boolean {
    const data = this.read();
    const originalLength = data.messages.length;
    data.messages = data.messages.filter((message) => !(message.messageId === messageId && (message.accountId === accountId || message.toAccountId === accountId)));
    const changed = data.messages.length !== originalLength;
    if (changed) this.write(data);
    return changed;
  }

  listFriendRequests(accountId: number, sent: boolean): StoredFriendRequest[] {
    const data = this.read();
    return [...data.friendRequests]
      .filter((request) => sent ? request.accountId === accountId : request.toAccountId === accountId)
      .sort((a, b) => b.requestId - a.requestId);
  }

  createFriendRequest(accountId: number, toAccountId: number, comment: string): StoredFriendRequest {
    const data = this.read();
    const request: StoredFriendRequest = {
      requestId: data.nextFriendRequestId++,
      accountId,
      toAccountId,
      comment,
      isNew: 0,
      timestamp: Math.floor(Date.now() / 1000)
    };

    data.friendRequests.push(request);
    this.write(data);
    return request;
  }

  findFriendRequest(requestId: number): StoredFriendRequest | undefined {
    return this.read().friendRequests.find((request) => request.requestId === requestId);
  }

  deleteFriendRequest(requestId: number, accountId: number): boolean {
    const data = this.read();
    const originalLength = data.friendRequests.length;
    data.friendRequests = data.friendRequests.filter((request) => !(request.requestId === requestId && (request.accountId === accountId || request.toAccountId === accountId)));
    const changed = data.friendRequests.length !== originalLength;
    if (changed) this.write(data);
    return changed;
  }

  markFriendRequestRead(requestId: number, accountId: number): StoredFriendRequest | null {
    const data = this.read();
    const index = data.friendRequests.findIndex((request) => request.requestId === requestId && request.toAccountId === accountId);
    if (index === -1) return null;

    data.friendRequests[index] = { ...data.friendRequests[index], isNew: 1 };
    this.write(data);
    return data.friendRequests[index];
  }

  friendshipExists(accountId: number, targetAccountId: number): boolean {
    return this.read().friendships.some((friendship) => (friendship.person1 === accountId && friendship.person2 === targetAccountId) || (friendship.person1 === targetAccountId && friendship.person2 === accountId));
  }

  createFriendship(accountId: number, targetAccountId: number): StoredFriendship {
    const data = this.read();
    const friendship: StoredFriendship = {
      friendshipId: data.nextFriendshipId++,
      person1: accountId,
      person2: targetAccountId,
      isNew1: 1,
      isNew2: 1
    };

    data.friendships.push(friendship);
    this.write(data);
    return friendship;
  }

  listFriendships(accountId: number): StoredFriendship[] {
    return this.read().friendships.filter((friendship) => friendship.person1 === accountId || friendship.person2 === accountId);
  }

  clearFriendshipNewFlags(accountId: number): void {
    const data = this.read();
    let changed = false;

    data.friendships = data.friendships.map((friendship) => {
      if (friendship.person2 === accountId && friendship.isNew1 !== 0) {
        changed = true;
        return { ...friendship, isNew1: 0 };
      }
      if (friendship.person1 === accountId && friendship.isNew2 !== 0) {
        changed = true;
        return { ...friendship, isNew2: 0 };
      }
      return friendship;
    });

    if (changed) this.write(data);
  }

  removeFriendship(accountId: number, targetAccountId: number): boolean {
    const data = this.read();
    const originalLength = data.friendships.length;
    data.friendships = data.friendships.filter((friendship) => !((friendship.person1 === accountId && friendship.person2 === targetAccountId) || (friendship.person1 === targetAccountId && friendship.person2 === accountId)));
    const changed = data.friendships.length !== originalLength;
    if (changed) this.write(data);
    return changed;
  }

  listBlocksForAccount(accountId: number): StoredBlock[] {
    return this.read().blocks.filter((block) => block.person1 === accountId);
  }

  isBlocked(accountId: number, targetAccountId: number): boolean {
    return this.read().blocks.some((block) => block.person1 === accountId && block.person2 === targetAccountId);
  }

  createBlock(accountId: number, targetAccountId: number): StoredBlock {
    const data = this.read();
    const block: StoredBlock = {
      blockId: data.nextBlockId++,
      person1: accountId,
      person2: targetAccountId
    };

    data.blocks.push(block);
    this.write(data);
    return block;
  }

  removeBlock(accountId: number, targetAccountId: number): boolean {
    const data = this.read();
    const originalLength = data.blocks.length;
    data.blocks = data.blocks.filter((block) => !(block.person1 === accountId && block.person2 === targetAccountId));
    const changed = data.blocks.length !== originalLength;
    if (changed) this.write(data);
    return changed;
  }

  updateLevel(levelId: number, updater: (level: StoredLevel) => StoredLevel): StoredLevel | null {
    const data = this.read();
    const index = data.levels.findIndex((level) => level.levelId === levelId);
    if (index === -1) return null;

    data.levels[index] = {
      ...updater(data.levels[index]),
      levelId,
      updateDate: Math.floor(Date.now() / 1000)
    };
    this.write(data);
    return data.levels[index];
  }

  countItemLikesForIp(itemId: number, type: number, ip: string): number {
    return this.read().itemLikes.filter((entry) => entry.itemId === itemId && entry.type === type && entry.ip === ip).length;
  }

  addItemLike(itemId: number, type: number, isLike: number, ip: string): void {
    const data = this.read();
    data.itemLikes.push({ itemId, type, isLike, ip, timestamp: Math.floor(Date.now() / 1000) });
    this.write(data);
  }

  applyItemLike(itemId: number, type: number, isLike: number): boolean {
    const sign = isLike === 1 ? 1 : -1;
    if (type === 1) return Boolean(this.updateLevel(itemId, (level) => ({ ...level, likes: level.likes + sign })));
    if (type === 2) return Boolean(this.updateCommentLikes(itemId, sign));
    if (type === 3) return Boolean(this.updateAccountCommentLikes(itemId, sign));
    if (type === 4) return Boolean(this.updateLevelListLikes(itemId, sign));
    return false;
  }

  private updateCommentLikes(commentId: number, delta: number): StoredComment | null {
    const data = this.read();
    const index = data.comments.findIndex((comment) => comment.commentId === commentId);
    if (index === -1) return null;
    data.comments[index] = { ...data.comments[index], likes: data.comments[index].likes + delta };
    this.write(data);
    return data.comments[index];
  }

  private updateAccountCommentLikes(accountCommentId: number, delta: number): StoredAccountComment | null {
    const data = this.read();
    const index = data.accountComments.findIndex((comment) => comment.accountCommentId === accountCommentId);
    if (index === -1) return null;
    data.accountComments[index] = { ...data.accountComments[index], likes: data.accountComments[index].likes + delta };
    this.write(data);
    return data.accountComments[index];
  }

  private updateLevelListLikes(listId: number, delta: number): StoredLevelList | null {
    const data = this.read();
    const index = data.levelLists.findIndex((list) => list.listId === listId);
    if (index === -1) return null;
    data.levelLists[index] = { ...data.levelLists[index], likes: data.levelLists[index].likes + delta };
    this.write(data);
    return data.levelLists[index];
  }

  findReportByLevelAndIp(levelId: number, ip: string): StoredLevelReport | undefined {
    return this.read().levelReports.find((report) => report.levelId === levelId && report.ip === ip);
  }

  createLevelReport(levelId: number, ip: string): StoredLevelReport {
    const data = this.read();
    const report: StoredLevelReport = {
      reportId: data.nextReportId++,
      levelId,
      ip,
      timestamp: Math.floor(Date.now() / 1000)
    };
    data.levelReports.push(report);
    this.write(data);
    return report;
  }

  getDailyFeature(type: 0 | 1 | 2, currentTime: number): StoredDailyFeature | undefined {
    return [...this.read().dailyFeatures]
      .filter((feature) => feature.type === type && feature.timestamp < currentTime && feature.duration >= currentTime)
      .sort((a, b) => a.duration - b.duration)[0];
  }

  listQuestTemplates(): StoredQuestTemplate[] {
    return [...this.read().quests];
  }

  getQuestSeed(userId: number): number {
    return userId * 13;
  }

  getMapPacks(page: number): { items: StoredMapPack[]; total: number } {
    const packs = [...this.read().mapPacks].sort((a, b) => a.mapPackId - b.mapPackId);
    return { items: packs.slice(page * 10, (page + 1) * 10), total: packs.length };
  }

  listGauntlets(): StoredGauntlet[] {
    return [...this.read().gauntlets].sort((a, b) => a.gauntletId - b.gauntletId);
  }

  getLevelLists(page: number): { items: StoredLevelList[]; total: number } {
    const lists = [...this.read().levelLists].sort((a, b) => b.updateDate - a.updateDate || b.listId - a.listId);
    return { items: lists.slice(page * 10, (page + 1) * 10), total: lists.length };
  }

  createOrUpdateLevelList(input: Omit<StoredLevelList, "listId" | "uploadDate" | "updateDate">, existingListId?: number): StoredLevelList {
    const data = this.read();
    const timestamp = Math.floor(Date.now() / 1000);

    if (existingListId) {
      const index = data.levelLists.findIndex((list) => list.listId === existingListId);
      if (index !== -1) {
        data.levelLists[index] = {
          ...data.levelLists[index],
          ...input,
          listId: existingListId,
          updateDate: timestamp
        };
        this.write(data);
        return data.levelLists[index];
      }
    }

    const nextListId = data.levelLists.reduce((max, list) => Math.max(max, list.listId), 0) + 1;
    const list: StoredLevelList = {
      listId: nextListId,
      uploadDate: timestamp,
      updateDate: timestamp,
      ...input
    };

    data.levelLists.push(list);
    this.write(data);
    return list;
  }

  deleteLevelList(listId: number, accountId: number): StoredLevelList | null {
    const data = this.read();
    const index = data.levelLists.findIndex((list) => list.listId === listId && list.accountId === accountId);
    if (index === -1) return null;
    const [deleted] = data.levelLists.splice(index, 1);
    this.write(data);
    return deleted;
  }

  deleteLevel(levelId: number, userId: number): StoredLevel | null {
    const data = this.read();
    const index = data.levels.findIndex((level) => level.levelId === levelId && level.userId === userId && level.stars === 0);
    if (index === -1) return null;
    const [deleted] = data.levels.splice(index, 1);
    data.comments = data.comments.filter((comment) => comment.levelId !== levelId);
    this.write(data);
    return deleted;
  }
  updateChestState(userId: number, chest: 1 | 2, timestamp: number): StoredUser | null {
    return this.updateUser(userId, (user) => chest === 1 ? {
      ...user,
      chest1Time: timestamp,
      chest1Count: user.chest1Count + 1
    } : {
      ...user,
      chest2Time: timestamp,
      chest2Count: user.chest2Count + 1
    });
  }

  findVaultCodeByKey(rewardKey: string): StoredVaultCode | undefined {
    const encoded = Buffer.from(rewardKey).toString("base64");
    return this.read().vaultCodes.find((code) => code.code === encoded);
  }

  hasClaimedVaultCode(accountId: number, rewardId: number): boolean {
    return this.read().vaultClaims.some((claim) => claim.accountId === accountId && claim.rewardId === rewardId);
  }

  claimVaultCode(accountId: number, rewardId: number): void {
    const data = this.read();
    if (!data.vaultClaims.some((claim) => claim.accountId === accountId && claim.rewardId === rewardId)) {
      data.vaultClaims.push({ accountId, rewardId });
      this.write(data);
    }
  }

  getAccountSave(accountId: number): StoredAccountSave | undefined {
    return this.read().saves.find((save) => save.accountId === accountId);
  }

  upsertAccountSave(accountId: number, saveData: string): StoredAccountSave {
    const data = this.read();
    const existingIndex = data.saves.findIndex((save) => save.accountId === accountId);
    const payload: StoredAccountSave = {
      accountId,
      saveData,
      updatedAt: Math.floor(Date.now() / 1000)
    };

    if (existingIndex === -1) {
      data.saves.push(payload);
    } else {
      data.saves[existingIndex] = payload;
    }

    this.write(data);
    return payload;
  }

  decrementVaultCodeUses(rewardId: number): StoredVaultCode | null {
    const data = this.read();
    const index = data.vaultCodes.findIndex((code) => code.rewardId === rewardId);
    if (index === -1) return null;
    if (data.vaultCodes[index].uses > 0) {
      data.vaultCodes[index] = { ...data.vaultCodes[index], uses: data.vaultCodes[index].uses - 1 };
      this.write(data);
    }
    return data.vaultCodes[index];
  }}









