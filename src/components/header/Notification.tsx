// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////



import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    IconButton,
    Modal,
    Typography,
    Divider,
    Avatar,
    Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux";
import { listenForNotifications, registerUser, removeNotificationListener } from "../../socket";

// -------------------
// Types
// -------------------
// interface NotificationItem {
//    ?.id: string;
//     userId: string;
//     type: string;
//     senderUserId: string;
//     name: string;
//     username: string;
//     profileUrl: string;
// }

// -------------------
// Initial Dummy Data
// -------------------
// const sampleNotifications: NotificationItem[] = [

// ];
const sampleNotifications: any[] = [

];

// -------------------
// Component
// -------------------
const Notification: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<
    // NotificationItem[]
    any[]
    >(sampleNotifications);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const user = useSelector((state: any) => state.auth.user);
    const currentUserId = user?.id;
    // Initialize socket connection
    useEffect(() => {
        const handleNotification = (notification: any) => {
          setNotifications((prev) => [notification, ...prev]);
        };
        console.log(notifications);
        listenForNotifications(handleNotification);
    
        return () => {
          removeNotificationListener(handleNotification); // Properly typed cleanup
        };
      }, [setNotifications]);
      

    const handleClearAll = () => {
        setNotifications([]);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif?.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    return (
        <>
            {/* Notification Bell */}
            <IconButton color="primary" onClick={() => setOpen(true)}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            {/* Notifications Modal */}
            <Modal
                open={open}
                onClose={() => {}}
                disableEscapeKeyDown
                aria-labelledby="notifications-modal"
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            backdropFilter: "blur(4px)",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "40px", // some space from top
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 500,
                        maxHeight: "85vh",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: "12px",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "bold",
                                flex: 1,
                            }}
                        >
                            Notifications
                        </Typography>

                        <Button
                            onClick={handleClearAll}
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                color: "primary.main",
                            }}
                        >
                            Clear All
                        </Button>
                    </Box>

                    <Divider />

                    {/* Notification List */}
                    <Box
                        sx={{
                            mt: 1.5,
                            overflowY: "auto",
                            maxHeight: "70vh",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            px: 2,
                            mb: 3,
                        }}
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notif) => {
                                const isHovered = hoveredId === notif?.id;

                                return (
                                    <Box
                                        key={notif?.id}
                                        onMouseEnter={() => setHoveredId(notif?.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            p: 1,
                                            borderRadius: "8px",
                                            transition: "background 0.3s",
                                            "&:hover": {
                                                backgroundColor: "rgba(0,0,0,0.04)",
                                            },
                                        }}
                                    >
                                        {/* Avatar + Message */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.2,
                                                flex: 1,
                                            }}
                                        >
                                            <Avatar src={notif.profileUrl} alt={notif.username} />
                                            <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                                                <strong>{notif.name}</strong> {notif.type}
                                            </Typography>
                                        </Box>

                                        {/* Date/Time or Mark As Read */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-end",
                                                minWidth: 80,
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {!isHovered ? (
                                                <>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {/* {notif.date} */}
                                                        date
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {/* {notif.time} */}
                                                        time
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Button
                                                    onClick={() => markAsRead(notif?.id)}
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<CheckCircleOutlineIcon />}
                                                    sx={{
                                                        textTransform: "none",
                                                        borderRadius: "8px",
                                                        fontSize: "0.75rem",
                                                        padding: "2px 8px",
                                                    }}
                                                >
                                                    Mark as Read
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ mt: 4 }}
                            >
                                No notifications available
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Notification;
