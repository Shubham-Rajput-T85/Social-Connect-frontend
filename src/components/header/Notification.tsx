import React, { useState, useEffect, useCallback } from "react";
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

import { listenForNotifications, removeNotificationListener } from "../../socket";
import { FormatDateTime, NotificationItem, NotificationMessage } from "../../api/constants/notification.contants";
import { NotificationService } from "../../api/services/notification.service";
import { BASE_URL } from "../../api/endpoints";

const Notification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const user = useSelector((state: any) => state.auth.user);
  const currentUserId = user?._id;

  /** Fetch notifications on initial load */
  const fetchNotifications = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const response = await NotificationService.getNotification(currentUserId);
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      const notifications: NotificationItem[] = data.notifications;
      console.log(notifications);
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [currentUserId]);

  /** Socket listener for real-time notifications */
  useEffect(() => {
    const handleNotification = (notification: NotificationItem) => {
      setNotifications((prev) => [notification, ...prev]); // prepend new
    };

    listenForNotifications(handleNotification);

    return () => {
      removeNotificationListener(handleNotification);
    };
  }, []);

  /** Fetch on mount or when user changes */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /** Clear all notifications */
  const handleClearAll = async () => {
    if (!currentUserId) return;
    try {
      const response = await NotificationService.clearNotification(currentUserId);
      if (response.ok) {
        setNotifications([]); // Optimistic update
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  /** Mark a notification as read */
  const markAsRead = async (id: string) => {
    try {
      const response = await NotificationService.readNotification(id);
      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notif) =>
            notif._id !== id
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  console.log(notifications);
  

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
        onClose={() => setOpen(false)}
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
            top: "40px",
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
                const isHovered = hoveredId === notif._id;

                return (
                  <Box
                    key={notif._id}
                    onMouseEnter={() => setHoveredId(notif._id)}
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
                      <Avatar src={ BASE_URL + notif.senderUserId.profileUrl} alt={notif.senderUserId.username} />
                      <Typography
                        variant="body2"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        <strong>{notif.senderUserId.name}</strong> { NotificationMessage(notif.type) }
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
                          <Typography variant="caption" color="text.secondary">
                            { FormatDateTime.formatDate(notif.createdAt)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            { FormatDateTime.formatTime(notif.createdAt)}
                          </Typography>
                        </>
                      ) : (
                        <Button
                          onClick={() => markAsRead(notif._id)}
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
