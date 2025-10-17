export const BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    // LOGIN: `${BASE_URL}/auth/login`,
    // REGISTER: `${BASE_URL}/auth/register`,
    // LOGOUT: `${BASE_URL}/auth/logout`,
  },
  USER: {
    TOGGLE_ACCOUNT_STATUS: `${BASE_URL}/user/updateAccountStatus`,
    SUGGESTED_FRIEND: `${BASE_URL}/user/suggestedFriends`
    // PROFILE: (userId: string) => `${BASE_URL}/user/${userId}`,
    // UPDATE: `${BASE_URL}/user/update`,
  },
  POSTS: {
    // CREATE: `${BASE_URL}/posts/create`,
    FEED_MYPOST: `${BASE_URL}/posts/feed/myPost`,
    GET_POST_BY_USER: (userId: string) => `${BASE_URL}/posts/getPosts/${userId}`,
    FEED_HOME: (page: number, limit: number) => `${BASE_URL}/posts/feed/home?page=${page}&limit=${limit}`,
  },
  LIKE: {
    LIKE_POST: (postId: string) => `${BASE_URL}/posts/${postId}/like`,
    UNDO_LIKE_POST: (postId: string) => `${BASE_URL}/posts/${postId}/like/undo`,
    CHECK_IS_LIKE: (postId: string) => `${BASE_URL}/posts/${postId}/islike`,
    GET_USER_WHO_LIKE: (postId: string) => `${BASE_URL}/posts/${postId}/getUser`,
  },
  COMMENTS: {
    GET_COMMENTS: (postId: string, page: number, limit: number) => `${BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`,
    ADD_COMMENTS: (postId: string) => `${BASE_URL}/posts/${postId}/comments/add`,
    EDIT_COMMENTS: (postId: string, commentId: string) => `${BASE_URL}/posts/${postId}/comments/edit/${commentId}`,
    DELETE_COMMENTS: (postId: string, commentId: string) => `${BASE_URL}/posts/${postId}/comments/delete/${commentId}`
  },
  FOLLOW: {
    GET_FOLLOW_STATE: (targetUserId: string) => `${BASE_URL}/user/followState?targetUserId=${targetUserId}`,
    SEND_FOLLOW_REQUEST: (targetUserId: string) => `${BASE_URL}/user/follow/${targetUserId}`,
    GET_FOLLOWED_BY_USER: (profileUserId: string) => `${BASE_URL}/user/getFollowedBy?profileUserId=${profileUserId}`
  },
  NOTIFICATION: {
    GET: (userId: string) => `${BASE_URL}/notification?userId=${userId}`,
    CLEAR: (userId: string) => `${BASE_URL}/notification/clear?userId=${userId}`,
    READ: (notificationId: string) => `${BASE_URL}/notification/read?id=${notificationId}`,
  },
  CONVERSATION: {
    GET: `${BASE_URL}/conversation`,
    ADD: `${BASE_URL}/conversation`,
    DELETE: (conversationId: string) => `${BASE_URL}/conversation/${conversationId}`
  },
  MESSAGE: {
    GET: (conversationId: string, page: number, limit: number) => `${BASE_URL}/messages/${conversationId}?page=${page}&limit=${limit}`,
    SEND: (conversationId: string) => `${BASE_URL}/messages/${conversationId}`,
    UPDATE_STATUS: (messageId: string) => `${BASE_URL}/messages/status/${messageId}`,
    EDIT: (messageId: string) => `${BASE_URL}/messages/edit/${messageId}`,
    DELETE: (messageId: string) => `${BASE_URL}/messages/delete/${messageId}`,
  },
  STORY: {
    ADD: () => `${BASE_URL}/story/add`,
    FEED: (userId?: string) =>
      userId
        ? `${BASE_URL}/story/feed/${userId}`
        : `${BASE_URL}/story/feed`,
    VIEW: (storyId: string) => `${BASE_URL}/story/${storyId}/view`,
    DELETE: (storyId: string) => `${BASE_URL}/story/${storyId}/delete`,
  }
};