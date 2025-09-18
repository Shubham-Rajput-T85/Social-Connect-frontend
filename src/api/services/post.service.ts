import { API_ENDPOINTS } from "../endpoints";

export interface IPost {
  _id: string;
  postContent: string;
  media?: {
    url: string;
    type: "image" | "video";
  };
  likeCount: number;
  commentsCount: number;
  createdAt: string;
  userId: {
    username: string;
    email: string;
    name: string;
    profileUrl: string;
    bio: string;
  };
}

export const PostService = {
    getMyPost: async () => {
        const response = await fetch(API_ENDPOINTS.POSTS.FEED_MYPOST, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 
          return response;
    },
    getHomeFeed: async (page: number = 1, limit: number = 10) => {
      const response = await fetch(API_ENDPOINTS.POSTS.FEED_HOME(page, limit), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Failed to fetch home feed");
  
      return await response.json();
    },
}