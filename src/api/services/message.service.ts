import { API_ENDPOINTS } from "../endpoints";

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    SEEN = "seen",
}

export type IMessage = {
    _id: string;
    conversationId : string;
    sender: {
        _id: string;
        name: string;
        username: string;
        profileUrl: string;
    };
    text: string;
    status: MessageStatus;
    createdAt: string;
    updatedAt?: string;
    deliveredTo?: string[];
    seenby?: string[];
}

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
    sendMessage: async (conversationId: string, body: Object) => {
        const response = await fetch(API_ENDPOINTS.MESSAGE.SEND(conversationId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
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