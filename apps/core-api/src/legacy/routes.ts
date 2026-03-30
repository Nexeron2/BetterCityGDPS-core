import type { LegacyRoute } from "./types";

export const legacyRoutes: LegacyRoute[] = [
  {
    path: "/getAccountURL.php",
    module: "accounts",
    operation: "misc.account-url",
    method: "GET",
    description: "Returns the current account service base URL."
  },
  {
    path: "/getAccountURL.php",
    module: "accounts",
    operation: "misc.account-url",
    method: "POST",
    description: "Returns the current account service base URL for legacy POST callers."
  },
  {
    path: "/getCustomContentURL.php",
    module: "accounts",
    operation: "misc.account-url",
    method: "GET",
    description: "Returns the current custom content base URL."
  },
  {
    path: "/getCustomContentURL.php",
    module: "accounts",
    operation: "misc.account-url",
    method: "POST",
    description: "Returns the current custom content base URL for legacy POST callers."
  },
  {
    path: "/requestUserAccess.php",
    module: "moderation",
    operation: "moderation.request-access",
    method: "POST",
    description: "Returns moderator access state for the current account."
  },
  {
    path: "/getGJLevels.php",
    module: "levels",
    operation: "levels.browse",
    method: "POST",
    description: "Level search and browse endpoint compatibility."
  },
  {
    path: "/getGJLevels20.php",
    module: "levels",
    operation: "levels.browse.v20",
    method: "POST",
    description: "Level search compatibility for 2.0 clients."
  },
  {
    path: "/getGJLevels21.php",
    module: "levels",
    operation: "levels.browse.v21",
    method: "POST",
    description: "Level search compatibility for 2.1+ clients."
  },
  {
    path: "/uploadGJLevel.php",
    module: "levels",
    operation: "levels.upload",
    method: "POST",
    description: "Level upload endpoint compatibility."
  },
  {
    path: "/uploadGJLevel21.php",
    module: "levels",
    operation: "levels.upload.v21",
    method: "POST",
    description: "Level upload compatibility for newer clients."
  },
  {
    path: "/downloadGJLevel.php",
    module: "levels",
    operation: "levels.download",
    method: "POST",
    description: "Base level download endpoint compatibility."
  },
  {
    path: "/downloadGJLevel22.php",
    module: "levels",
    operation: "levels.download.v22",
    method: "POST",
    description: "Level download endpoint compatibility for newer clients."
  },
  {
    path: "/rateGJStars20.php",
    module: "levels",
    operation: "levels.rate-stars",
    method: "POST",
    description: "Star rating compatibility route."
  },
  {
    path: "/rateGJDemon21.php",
    module: "levels",
    operation: "levels.rate-demon",
    method: "POST",
    description: "Demon rating compatibility route."
  },
  {
    path: "/suggestGJStars20.php",
    module: "moderation",
    operation: "moderation.suggest-stars",
    method: "POST",
    description: "Suggestion queue compatibility route."
  },
  {
    path: "/accounts/loginGJAccount.php",
    module: "accounts",
    operation: "accounts.login",
    method: "POST",
    description: "Legacy account login compatibility."
  },
  {
    path: "/accounts/registerGJAccount.php",
    module: "accounts",
    operation: "accounts.register",
    method: "POST",
    description: "Legacy account registration compatibility."
  },
  {
    path: "/accounts/syncGJAccount.php",
    module: "accounts",
    operation: "accounts.sync",
    method: "POST",
    description: "Legacy account sync compatibility."
  },
  {
    path: "/accounts/syncGJAccount20.php",
    module: "accounts",
    operation: "accounts.sync",
    method: "POST",
    description: "Legacy account sync compatibility for 2.0 clients."
  },
  {
    path: "/accounts/backupGJAccount.php",
    module: "accounts",
    operation: "accounts.backup",
    method: "POST",
    description: "Legacy cloud-save backup compatibility."
  },
  {
    path: "/database/accounts/syncGJAccountNew.php",
    module: "accounts",
    operation: "accounts.sync",
    method: "POST",
    description: "Legacy database sync compatibility alias."
  },
  {
    path: "/database/accounts/backupGJAccountNew.php",
    module: "accounts",
    operation: "accounts.backup",
    method: "POST",
    description: "Legacy database backup compatibility alias."
  },
  {
    path: "/getGJAccountComments20.php",
    module: "players",
    operation: "players.account-comments.list",
    method: "POST",
    description: "Account profile comments compatibility."
  },
  {
    path: "/uploadGJAccComment20.php",
    module: "players",
    operation: "players.account-comments.create",
    method: "POST",
    description: "Account profile comment creation compatibility."
  },
  {
    path: "/deleteGJAccComment20.php",
    module: "players",
    operation: "players.account-comments.delete",
    method: "POST",
    description: "Account profile comment deletion compatibility."
  },
  {
    path: "/getGJUserInfo20.php",
    module: "players",
    operation: "players.info",
    method: "POST",
    description: "Player profile fetch compatibility."
  },
  {
    path: "/getGJUsers20.php",
    module: "players",
    operation: "players.search",
    method: "POST",
    description: "Player search compatibility route."
  },
  {
    path: "/submitGJUserInfo.php",
    module: "players",
    operation: "players.info.submit",
    method: "POST",
    description: "Basic player info submission compatibility."
  },
  {
    path: "/updateGJAccSettings20.php",
    module: "players",
    operation: "players.settings.update",
    method: "POST",
    description: "Account settings update compatibility."
  },
  {
    path: "/getGJComments21.php",
    module: "comments",
    operation: "comments.level.list",
    method: "POST",
    description: "Level comments list compatibility."
  },
  {
    path: "/getGJComments.php",
    module: "comments",
    operation: "comments.level.list",
    method: "POST",
    description: "Legacy level comments compatibility."
  },
  {
    path: "/getGJComments19.php",
    module: "comments",
    operation: "comments.level.list",
    method: "POST",
    description: "Legacy level comments compatibility for older clients."
  },
  {
    path: "/getGJComments20.php",
    module: "comments",
    operation: "comments.level.list",
    method: "POST",
    description: "Legacy level comments compatibility for 2.0 clients."
  },
  {
    path: "/getGJCommentHistory.php",
    module: "comments",
    operation: "comments.level.list",
    method: "POST",
    description: "Legacy comment history alias."
  },
  {
    path: "/uploadGJComment21.php",
    module: "comments",
    operation: "comments.level.create",
    method: "POST",
    description: "Level comment creation compatibility."
  },
  {
    path: "/deleteGJComment20.php",
    module: "comments",
    operation: "comments.level.delete",
    method: "POST",
    description: "Level comment deletion compatibility."
  },
  {
    path: "/getGJMessages20.php",
    module: "messages",
    operation: "messages.list",
    method: "POST",
    description: "Private message inbox compatibility."
  },
  {
    path: "/uploadGJMessage20.php",
    module: "messages",
    operation: "messages.send",
    method: "POST",
    description: "Private message send compatibility."
  },
  {
    path: "/downloadGJMessage20.php",
    module: "messages",
    operation: "messages.download",
    method: "POST",
    description: "Private message open/download compatibility."
  },
  {
    path: "/deleteGJMessages20.php",
    module: "messages",
    operation: "messages.delete",
    method: "POST",
    description: "Private message delete compatibility."
  },
  {
    path: "/uploadFriendRequest20.php",
    module: "relationships",
    operation: "relationships.friend-request.create",
    method: "POST",
    description: "Friend request send compatibility."
  },
  {
    path: "/acceptGJFriendRequest20.php",
    module: "relationships",
    operation: "relationships.friend-request.accept",
    method: "POST",
    description: "Friend request accept compatibility."
  },
  {
    path: "/getGJFriendRequests20.php",
    module: "relationships",
    operation: "relationships.friend-request.list",
    method: "POST",
    description: "Friend request list compatibility."
  },
  {
    path: "/readGJFriendRequest20.php",
    module: "relationships",
    operation: "relationships.friend-request.read",
    method: "POST",
    description: "Friend request mark-read compatibility."
  },
  {
    path: "/deleteGJFriendRequests20.php",
    module: "relationships",
    operation: "relationships.friend-request.delete",
    method: "POST",
    description: "Friend request delete compatibility."
  },
  {
    path: "/getGJUserList20.php",
    module: "relationships",
    operation: "relationships.user-list",
    method: "POST",
    description: "Friends and blocked users list compatibility."
  },
  {
    path: "/removeGJFriend20.php",
    module: "relationships",
    operation: "relationships.friend.remove",
    method: "POST",
    description: "Friend removal compatibility."
  },
  {
    path: "/unblockGJUser20.php",
    module: "relationships",
    operation: "relationships.block.remove",
    method: "POST",
    description: "Player unblock compatibility route."
  },
  {
    path: "/blockGJUser20.php",
    module: "relationships",
    operation: "relationships.block.create",
    method: "POST",
    description: "Player block compatibility route."
  },
  {
    path: "/getGJScores20.php",
    module: "scores",
    operation: "scores.global",
    method: "POST",
    description: "Global leaderboard compatibility."
  },
  {
    path: "/getGJScores.php",
    module: "scores",
    operation: "scores.global",
    method: "POST",
    description: "Legacy global leaderboard compatibility."
  },
  {
    path: "/getGJScores19.php",
    module: "scores",
    operation: "scores.global",
    method: "POST",
    description: "Legacy global leaderboard compatibility for older clients."
  },
  {
    path: "/getGJCreators.php",
    module: "scores",
    operation: "scores.creators",
    method: "POST",
    description: "Creator leaderboard compatibility."
  },
  {
    path: "/getGJCreators19.php",
    module: "scores",
    operation: "scores.creators",
    method: "POST",
    description: "Creator leaderboard compatibility for older clients."
  },
  {
    path: "/updateGJUserScore22.php",
    module: "scores",
    operation: "scores.user.update",
    method: "POST",
    description: "User score update compatibility for newer clients."
  },
  {
    path: "/updateGJUserScore20.php",
    module: "scores",
    operation: "scores.user.update",
    method: "POST",
    description: "User score update compatibility."
  },
  {
    path: "/getGJLevelScores211.php",
    module: "scores",
    operation: "scores.level",
    method: "POST",
    description: "Level leaderboard compatibility."
  },
  {
    path: "/getGJLevelScores.php",
    module: "scores",
    operation: "scores.level",
    method: "POST",
    description: "Legacy level leaderboard compatibility."
  },
  {
    path: "/getGJSongInfo.php",
    module: "songs",
    operation: "songs.info",
    method: "POST",
    description: "Song metadata compatibility."
  },
  {
    path: "/getGJTopArtists.php",
    module: "songs",
    operation: "songs.top-artists",
    method: "POST",
    description: "Top artists compatibility."
  },
  {
    path: "/getGJDailyLevel.php",
    module: "rewards",
    operation: "rewards.daily-level",
    method: "POST",
    description: "Daily and weekly feature compatibility route."
  },
  {
    path: "/getGJRewards.php",
    module: "rewards",
    operation: "rewards.daily",
    method: "POST",
    description: "Reward chest compatibility."
  },
  {
    path: "/getGJChallenges.php",
    module: "rewards",
    operation: "rewards.quests",
    method: "POST",
    description: "Quest compatibility route."
  },
  {
    path: "/getGJSecretReward.php",
    module: "rewards",
    operation: "rewards.secret",
    method: "POST",
    description: "Secret reward compatibility route."
  },
  {
    path: "/getGJMapPacks21.php",
    module: "lists",
    operation: "lists.map-packs",
    method: "POST",
    description: "Map pack compatibility for newer clients."
  },
  {
    path: "/getGJMapPacks.php",
    module: "lists",
    operation: "lists.map-packs",
    method: "POST",
    description: "Legacy map pack compatibility."
  },
  {
    path: "/getGJMapPacks20.php",
    module: "lists",
    operation: "lists.map-packs",
    method: "POST",
    description: "Legacy map pack compatibility for 2.0 clients."
  },
  {
    path: "/getGJGauntlets21.php",
    module: "lists",
    operation: "lists.gauntlets",
    method: "POST",
    description: "Gauntlet compatibility route."
  },
  {
    path: "/getGJGauntlets.php",
    module: "lists",
    operation: "lists.gauntlets",
    method: "POST",
    description: "Legacy gauntlet compatibility."
  },
  {
    path: "/getGJLevelLists.php",
    module: "lists",
    operation: "lists.level-lists",
    method: "POST",
    description: "Level list compatibility route."
  },
  {
    path: "/reportGJLevel.php",
    module: "moderation",
    operation: "moderation.report-level",
    method: "POST",
    description: "Level report compatibility route."
  },
  {
    path: "/likeGJItem211.php",
    module: "moderation",
    operation: "moderation.like-item",
    method: "POST",
    description: "Like/dislike compatibility for comments and levels."
  },
  {
    path: "/deleteGJComment.php",
    module: "comments",
    operation: "comments.level.delete",
    method: "POST",
    description: "Legacy level comment deletion compatibility."
  },
  {
    path: "/deleteGJComment19.php",
    module: "comments",
    operation: "comments.level.delete",
    method: "POST",
    description: "Legacy level comment deletion compatibility for older clients."
  },
  {
    path: "/deleteGJLevelList.php",
    module: "lists",
    operation: "lists.level-lists.delete",
    method: "POST",
    description: "Level list deletion compatibility route."
  },
  {
    path: "/deleteGJLevelUser20.php",
    module: "levels",
    operation: "levels.delete",
    method: "POST",
    description: "Player-owned level deletion compatibility route."
  },
  {
    path: "/downloadGJLevel19.php",
    module: "levels",
    operation: "levels.download",
    method: "POST",
    description: "Legacy level download compatibility for older clients."
  },
  {
    path: "/downloadGJLevel20.php",
    module: "levels",
    operation: "levels.download",
    method: "POST",
    description: "Legacy level download compatibility for 2.0 clients."
  },
  {
    path: "/downloadGJLevel21.php",
    module: "levels",
    operation: "levels.download",
    method: "POST",
    description: "Legacy level download compatibility for 2.1 clients."
  },
  {
    path: "/getGJLevels19.php",
    module: "levels",
    operation: "levels.browse",
    method: "POST",
    description: "Level search compatibility for older clients."
  },
  {
    path: "/getGJLevelScoresPlat.php",
    module: "scores",
    operation: "scores.level",
    method: "POST",
    description: "Platformer level leaderboard compatibility."
  },
  {
    path: "/likeGJItem.php",
    module: "moderation",
    operation: "moderation.like-item",
    method: "POST",
    description: "Legacy like/dislike compatibility."
  },
  {
    path: "/likeGJItem19.php",
    module: "moderation",
    operation: "moderation.like-item",
    method: "POST",
    description: "Legacy like/dislike compatibility for older clients."
  },
  {
    path: "/likeGJItem20.php",
    module: "moderation",
    operation: "moderation.like-item",
    method: "POST",
    description: "Legacy like/dislike compatibility for 2.0 clients."
  },
  {
    path: "/likeGJItem21.php",
    module: "moderation",
    operation: "moderation.like-item",
    method: "POST",
    description: "Legacy like/dislike compatibility for 2.1 clients."
  },
  {
    path: "/likeGJLevel.php",
    module: "moderation",
    operation: "moderation.like-item",
    method: "POST",
    description: "Legacy level-like compatibility route."
  },
  {
    path: "/rateGJLevel.php",
    module: "levels",
    operation: "levels.rate-stars",
    method: "POST",
    description: "Legacy level rating compatibility route."
  },
  {
    path: "/rateGJStars211.php",
    module: "levels",
    operation: "levels.rate-stars",
    method: "POST",
    description: "Star rating compatibility route for 2.11 clients."
  },
  {
    path: "/restoreGJItems.php",
    module: "accounts",
    operation: "accounts.items.restore",
    method: "POST",
    description: "Legacy account item restore compatibility route."
  },
  {
    path: "/updateGJDesc20.php",
    module: "levels",
    operation: "levels.description.update",
    method: "POST",
    description: "Level description update compatibility route."
  },
  {
    path: "/updateGJUserScore.php",
    module: "scores",
    operation: "scores.user.update",
    method: "POST",
    description: "Legacy user score update compatibility."
  },
  {
    path: "/updateGJUserScore19.php",
    module: "scores",
    operation: "scores.user.update",
    method: "POST",
    description: "Legacy user score update compatibility for older clients."
  },
  {
    path: "/updateGJUserScore21.php",
    module: "scores",
    operation: "scores.user.update",
    method: "POST",
    description: "Legacy user score update compatibility for 2.1 clients."
  },
  {
    path: "/uploadGJComment.php",
    module: "comments",
    operation: "comments.level.create",
    method: "POST",
    description: "Legacy level comment creation compatibility."
  },
  {
    path: "/uploadGJComment19.php",
    module: "comments",
    operation: "comments.level.create",
    method: "POST",
    description: "Legacy level comment creation compatibility for older clients."
  },
  {
    path: "/uploadGJComment20.php",
    module: "comments",
    operation: "comments.level.create",
    method: "POST",
    description: "Legacy level comment creation compatibility for 2.0 clients."
  },
  {
    path: "/uploadGJLevel19.php",
    module: "levels",
    operation: "levels.upload",
    method: "POST",
    description: "Legacy level upload compatibility for older clients."
  },
  {
    path: "/uploadGJLevel20.php",
    module: "levels",
    operation: "levels.upload",
    method: "POST",
    description: "Legacy level upload compatibility for 2.0 clients."
  },
  {
    path: "/uploadGJLevelList.php",
    module: "lists",
    operation: "lists.level-lists.upload",
    method: "POST",
    description: "Level list upload and update compatibility route."
  },  {
    path: "/__debug/data",
    module: "moderation",
    operation: "debug.snapshot",
    method: "GET",
    description: "Debug snapshot of the file-backed prototype data store."
  }
];





