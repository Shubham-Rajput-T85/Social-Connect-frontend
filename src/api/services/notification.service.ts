import { API_ENDPOINTS } from "../endpoints";

export const NotificationService = {
    getNotification: async (userId: string) => {
        const response = await fetch(API_ENDPOINTS.NOTIFICATION.GET(userId), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 
          return response;
    },
    clearNotification: async (userId: string) => {
        const response = await fetch(API_ENDPOINTS.NOTIFICATION.CLEAR(userId), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 
          return response;
    },
    readNotification: async (notificationId: string) => {
        console.log("calling read notification");
        
        const response = await fetch(API_ENDPOINTS.NOTIFICATION.READ(notificationId), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }); 
          return response;
    }
}