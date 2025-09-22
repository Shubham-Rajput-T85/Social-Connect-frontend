import { API_ENDPOINTS } from "../endpoints";

export interface CommentDTO {
    commentText: string;
}

export interface IComment {
  _id: string;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    bio: string;
    profileUrl: string;
  };
}

export const CommentsService = {
    getComments: async (postId: string, page: number = 1, limit: number = 10) => {
        const response = await fetch(API_ENDPOINTS.COMMENTS.GET_COMMENTS(postId, page, limit), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 

          if (!response.ok) throw new Error("Failed to get comment");

          return await response.json();
    },
    addComments: async (postId: string, data: CommentDTO) => {
        const response = await fetch(API_ENDPOINTS.COMMENTS.ADD_COMMENTS(postId), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          }); 

          if (!response.ok) throw new Error("Failed to add comment");

          return await response.json();
    },
    editComments: async (postId: string, commentId: string, data: CommentDTO) => {
      const response = await fetch(API_ENDPOINTS.COMMENTS.EDIT_COMMENTS(postId, commentId), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }); 

        if (!response.ok) throw new Error("Failed to add comment");

        return await response.json();
  },
    deleteComment: async (postId: string, commentId: string) => {
        const response = await fetch(API_ENDPOINTS.COMMENTS.DELETE_COMMENTS(postId, commentId), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 

          if (!response.ok) throw new Error("Failed to delete comment");

          return await response.json();
    }
}