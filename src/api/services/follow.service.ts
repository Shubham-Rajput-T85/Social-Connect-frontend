import { API_ENDPOINTS } from "../endpoints";

export const followService = {
    getFollowedByUserList: async (profileUserId: string) => {
        const response = await fetch(API_ENDPOINTS.FOLLOW.GET_FOLLOWED_BY_USER(profileUserId), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch followed by user");

        return await response.json();
    },
}