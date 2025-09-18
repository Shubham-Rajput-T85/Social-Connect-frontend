import { API_ENDPOINTS } from "../endpoints";

export const LikeService = {
    likePost: async (postId: string) => {
        const response = await fetch(API_ENDPOINTS.LIKE.LIKE_POST(postId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to like post");

        return await response.json();
    },
    undoLikePost: async (postId: string) => {
        const response = await fetch(API_ENDPOINTS.LIKE.UNDO_LIKE_POST(postId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to undo like post");

        return await response.json();
    },
    isLiked: async (postId: string) => {
        const response = await fetch(API_ENDPOINTS.LIKE.CHECK_IS_LIKE(postId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to check like status");

        return await response.json();
    },
    getUser: async (postId: string) => {
        const response = await fetch(API_ENDPOINTS.LIKE.GET_USER_WHO_LIKE(postId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to get user who liked post");

        return await response.json();
    },
}