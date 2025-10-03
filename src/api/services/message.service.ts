import { API_ENDPOINTS } from "../endpoints";

export const MessageService = {
    getMessages: async (conversationId: string, page: number = 1, limit: number = 20) => {
        const response = await fetch(API_ENDPOINTS.MESSAGE.GET(conversationId, page, limit), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch messages");

        return await response.json();
    },
    sendMessage: async (conversationId: string) => {
        const response = await fetch(API_ENDPOINTS.MESSAGE.SEND(conversationId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch messages");

        return await response.json();
    },
    updateStatus: async (messageId: string) => {
        const response = await fetch(API_ENDPOINTS.MESSAGE.UPDATE_STATUS(messageId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch messages");

        return await response.json();
    },
}