import { API_ENDPOINTS } from "../endpoints";

export const userService = {
    getSuggestedFriends: async (postId: string) => {
        const response = await fetch(API_ENDPOINTS.USER.SUGGESTED_FRIEND, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to like post");

        return await response.json();
    },
}