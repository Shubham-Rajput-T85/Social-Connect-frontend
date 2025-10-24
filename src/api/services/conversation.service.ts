import { API_ENDPOINTS } from "../endpoints";

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    SEEN = "seen",
}

export interface LastMessage {
  text: string;
  createdAt: string;  // ISO date string
  status: MessageStatus;
}

export interface ConversationUser {
  _id: string;
  username: string;
  profileUrl: string;
  online: boolean;
  name: string;
}

export interface IConversation {
  conversationId: string;
  user: ConversationUser;
  lastMessage: LastMessage | null;
  unreadCount: number;
  storyCount: number;
}

export const ConversationService = {
    getConversations: async (): Promise<IConversation[]> => {
        const response = await fetch(API_ENDPOINTS.CONVERSATION.GET, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 

          if (!response.ok) throw new Error("Failed to get conversations");

          const data = await response.json();
          console.log(data);
          if(data.success === false){
            throw new Error("internal server error");
          }
          return data.conversations;
    },
    deleteConversation: async (conversationId: string) => {
        const response = await fetch(API_ENDPOINTS.CONVERSATION.DELETE(conversationId), {
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