export interface NotificationItem {
    _id: string;
    userId: string;
    type: string;
    senderUserId: {
        _id: string;
        name: string;
        username: string;
        profileUrl: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const NotificationMessage = (messageType: string) => {
    switch (messageType) {
        case "like":
            return `has liked your post`;
        case "comment":
            return `has commented on your post`;
        case "followRequest":
            return `has sent you a follow request`;
        case "acceptedRequest":
            return `has accepted your follow request`;
    }
}

export const FormatDateTime = {
    formatDate: (createdAt: string) => { 
        const dateObj = new Date(createdAt);

        const date = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return date;
    },
    formatTime: (createdAt: string) => { 
        const dateObj = new Date(createdAt);

        const time = dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        return time;
    }
} ;