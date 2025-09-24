import { API_ENDPOINTS } from "../endpoints";

export const userService = {
    toggleAccountStatus: async () => {
        const response = await fetch(API_ENDPOINTS.USER.TOGGLE_ACCOUNT_STATUS, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to update account status");

        return await response.json();   
    },
    getSuggestedFriends: async () => {
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