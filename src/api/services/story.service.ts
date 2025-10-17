import { API_ENDPOINTS } from "../endpoints";

export type IMedia = {
    url: string;
    type: "image" | "video";
};

export type IStory = {
    _id: string;
    userId: {
        _id: string;
        username: string;
        name: string;
        profileUrl?: string;
    };
    caption?: string;
    media: IMedia;
    views: string[]; // array of userIds who viewed
    viewsCount: number;
    createdAt: string;
    expiresAt: string;
};

export const StoryService = {
    /**
     * 
     * @param mediaFile 
     * @param caption 
     * @returns { success: boolean, alertType, message, story: IStory }
     */
    addStory: async (mediaFile: File, caption?: string) => {
        const formData = new FormData();
        formData.append("media", mediaFile);
        if (caption) formData.append("caption", caption);

        const response = await fetch(API_ENDPOINTS.STORY.ADD(), {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to add story");
        return await response.json(); // returns { success, alertType, message, story }
    },
    /**
     * 
     * @param userId 
     * @returns {success: true, alertType: "info", message: string, stories: IStory[]}
     */
    getStoriesFeed: async (userId?: string) => {
        const endpoint = API_ENDPOINTS.STORY.FEED(userId);
        const response = await fetch(endpoint, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch stories");
        return await response.json();
    },

    // View a story
    viewStory: async (storyId: string) => {
        const response = await fetch(API_ENDPOINTS.STORY.VIEW(storyId), {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to view story");
        return await response.json();
    },

    // Delete a story
    /**
     * 
     * @param storyId 
     * @returns { success, alertType, message }
     */
    deleteStory: async (storyId: string) => {
        const response = await fetch(API_ENDPOINTS.STORY.DELETE(storyId), {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to delete story");
        return await response.json();
    },
};
