// src/api/endpoints.ts
export const BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    // LOGIN: `${BASE_URL}/auth/login`,
    // REGISTER: `${BASE_URL}/auth/register`,
    // LOGOUT: `${BASE_URL}/auth/logout`,
  },
  USER: {
    SUGGESTED_FRIEND: `${BASE_URL}/user/suggestedFriends`
    // PROFILE: (userId: string) => `${BASE_URL}/user/${userId}`,
    // UPDATE: `${BASE_URL}/user/update`,
  },
  // MESSAGES: {
  //   SEND: `${BASE_URL}/messages/send`,
  //   FETCH_CONVERSATION: (conversationId: string) =>
  //     `${BASE_URL}/messages/conversation/${conversationId}`,
  // },
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
    getFollowState: (targetUserId: string) => `${BASE_URL}/user/followState?targetUserId=${targetUserId}`,
    sendFollowRequest: (targetUserId: string) => `${BASE_URL}/user/follow/${targetUserId}`
  },
  NOTIFICATION: {
    GET: (userId: string) => `${BASE_URL}/notification?userId=${userId}`,
    CLEAR: (userId: string) => `${BASE_URL}/notification/clear?userId=${userId}`,
    READ: (notificationId: string) => `${BASE_URL}/notification/read?id=${notificationId}`,
  }
};
