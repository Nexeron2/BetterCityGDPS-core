import { legacyRoutes } from "./routes";
import { createCoreHandlers } from "../handlers/core-handlers";
import { sendText } from "../http/response";
import type { CoreApiConfig } from "../config";
import type { LegacyDispatcher, LegacyHandlerResult, LegacyRequestContext, MaybePromise } from "../http/types";
import type { LegacyRoute } from "./types";

function methodMismatch(route: LegacyRoute): LegacyHandlerResult {
  return sendText("-1", 405, {
    Allow: route.method,
    "x-bcgc-status": "method-not-allowed",
    "x-bcgc-operation": route.operation
  });
}

export function createLegacyDispatcher(config: CoreApiConfig): LegacyDispatcher {
  const routeMap = new Map(legacyRoutes.map((route) => [route.path, route]));
  const handlers = createCoreHandlers(config);

  const operationHandlers = new Map<string, (context: LegacyRequestContext) => MaybePromise<LegacyHandlerResult>>([
    ["misc.account-url", handlers.getAccountUrl],
    ["accounts.register", handlers.registerAccount],
    ["accounts.login", handlers.loginAccount],
    ["accounts.sync", handlers.syncAccount],
    ["accounts.backup", handlers.backupAccount],
    ["accounts.items.restore", handlers.restoreItems],
    ["players.info", handlers.getUserInfo],
    ["players.info.submit", handlers.submitUserInfo],
    ["players.search", handlers.searchUsers],
    ["players.settings.update", handlers.updateAccountSettings],
    ["players.account-comments.list", handlers.getAccountComments],
    ["players.account-comments.create", handlers.uploadAccountComment],
    ["players.account-comments.delete", handlers.deleteAccountComment],
    ["scores.user.update", handlers.updateUserScore],
    ["scores.global", handlers.getScores],
    ["scores.creators", handlers.getCreators],
    ["scores.level", handlers.getLevelScores],
    ["levels.browse", handlers.getLevels],
    ["levels.browse.v20", handlers.getLevels],
    ["levels.browse.v21", handlers.getLevels],
    ["levels.download", handlers.downloadLevel],
    ["levels.download.v22", handlers.downloadLevel],
    ["levels.upload", handlers.uploadLevel],
    ["levels.upload.v21", handlers.uploadLevel],
    ["levels.rate-stars", handlers.rateStars],
    ["levels.rate-demon", handlers.rateDemon],
    ["levels.delete", handlers.deleteLevel],
    ["levels.description.update", handlers.updateLevelDescription],
    ["comments.level.list", handlers.getComments],
    ["comments.level.create", handlers.uploadComment],
    ["comments.level.delete", handlers.deleteComment],
    ["moderation.report-level", handlers.reportLevel],
    ["moderation.like-item", handlers.likeItem],
    ["moderation.suggest-stars", handlers.suggestStars],
    ["messages.list", handlers.getMessages],
    ["messages.send", handlers.uploadMessage],
    ["messages.download", handlers.downloadMessage],
    ["messages.delete", handlers.deleteMessage],
    ["relationships.friend-request.create", handlers.uploadFriendRequest],
    ["relationships.friend-request.accept", handlers.acceptFriendRequest],
    ["relationships.friend-request.list", handlers.getFriendRequests],
    ["relationships.friend-request.read", handlers.readFriendRequest],
    ["relationships.friend-request.delete", handlers.deleteFriendRequest],
    ["relationships.user-list", handlers.getUserList],
    ["relationships.friend.remove", handlers.removeFriend],
    ["relationships.block.create", handlers.blockUser],
    ["relationships.block.remove", handlers.unblockUser],
    ["songs.info", handlers.getSongInfo],
    ["songs.top-artists", handlers.getTopArtists],
    ["rewards.daily-level", handlers.getDailyLevel],
    ["rewards.daily", handlers.getRewards],
    ["rewards.quests", handlers.getChallenges],
    ["rewards.secret", handlers.getSecretReward],
    ["lists.map-packs", handlers.getMapPacks],
    ["lists.gauntlets", handlers.getGauntlets],
    ["lists.level-lists", handlers.getLevelLists],
    ["lists.level-lists.upload", handlers.uploadLevelList],
    ["lists.level-lists.delete", handlers.deleteLevelList],
    ["moderation.request-access", handlers.requestUserAccess],
    ["debug.snapshot", handlers.debugSnapshot]
  ]);

  return {
    async dispatch(context) {
      const route = routeMap.get(context.pathname);
      if (!route) return null;
      if (route.method !== (context.request.method ?? "GET")) return methodMismatch(route);

      const handler = operationHandlers.get(route.operation);
      if (!handler) {
        return sendText("-1", 200, {
          "x-bcgc-status": "legacy-placeholder",
          "x-bcgc-module": route.module,
          "x-bcgc-operation": route.operation,
          "x-bcgc-request-method": route.method
        });
      }

      return await handler(context);
    }
  };
}








