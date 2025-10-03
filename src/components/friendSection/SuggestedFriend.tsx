import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";
import { userService } from "../../api/services/user.service";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../../api/endpoints";
import { alertActions } from "../store/alert-slice";

interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  profileUrl?: string;
  followersCount: number;
  followingCount: number;
  isPrivate: boolean;
}

export default function SuggestedFriend() {
  const friendsScrollRef = useRef<HTMLDivElement | null>(null);
  const [showFadeFriends, setShowFadeFriends] = useState<boolean>(true);
  const [suggestedFriends, setSuggestedFriends] = useState<SuggestedUser[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]); // track loading per user
  const currentUserId = useSelector((state: any) => state.auth.user._id);
  const dispatch = useDispatch();

  // Fetch suggested friends on mount
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await userService.getSuggestedFriends();
        setSuggestedFriends(res.users || []);
      } catch (err) {
        console.error("Failed to fetch suggested friends:", err);
      }
    };

    fetchSuggested();
  }, []);

  // Show fade only if scrollable
  useEffect(() => {
    const element = friendsScrollRef.current;
    if (element) {
      setShowFadeFriends(element.scrollHeight > element.clientHeight);
    }
  }, [suggestedFriends]);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setShowFade: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const element = ref.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;

    setShowFade(!(scrollTop + clientHeight >= scrollHeight - 2));
  };

  // Follow button click handler
  const handleFollowClick = async (targetUserId: string) => {
    setLoadingIds((prev) => [...prev, targetUserId]);
    try {
      const res = await fetch("http://localhost:8080/user/follow", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId,
          targetUserId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Follow action failed");

      // Show success alert
      dispatch(
        alertActions.showAlert({
          severity: "success",
          message: "Follow request sent",
        })
      );

      // Remove user from suggested friends
      setSuggestedFriends((prev) => prev.filter((u) => u._id !== targetUserId));
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: error.message || "Error while sending follow request",
        })
      );
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== targetUserId));
    }
  };

  console.log("calling suggestedfriends");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "30vh",
        borderLeft: "1px solid #eee",
        overflow: "hidden",
        borderRadius: "10px",
        mb: 2,
      }}
    >
      <Paper
        sx={{ display: "flex", flexDirection: "column", bgcolor: "background.paper", position: "relative" }}
      >
        <Box sx={{ p: 2, position: "sticky", top: 0, backgroundColor: "background.paper", zIndex: 2, borderRadius: "10px" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Suggested Friends
          </Typography>
        </Box>
        <hr style={{ color: "gray", margin: "10px", marginTop: "0" }} />
        <Box
          ref={friendsScrollRef}
          onScroll={() => handleScroll(friendsScrollRef as any, setShowFadeFriends)}
          sx={{ maxHeight: 200, overflowY: "auto", px: 2, pb: 2, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
        >
          <List sx={{ p: 0 }}>
            {suggestedFriends.length > 0 ? (
              suggestedFriends.map((friend) => (
                <ListItem
                  sx={{
                    py: 1,
                    px: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "nowrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Avatar
                      src={(BASE_URL + friend.profileUrl) || `https://i.pravatar.cc/150?u=${friend._id}`}
                      sx={{ width: 44, height: 44, flexShrink: 0 }}
                    />

                    <Box
                      sx={{
                        overflow: "hidden",
                        minWidth: 0,
                        flex: 1,
                        maxWidth: "75px",
                      }}
                    >
                      <Tooltip title={friend.name} arrow disableInteractive>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {friend.name}
                        </Typography>
                      </Tooltip>

                      <Tooltip title={`@${friend.username}`} arrow disableInteractive>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                          }}
                        >
                          @{friend.username}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>


                  <Button
                    variant="outlined"
                    size="small"
                    disabled={loadingIds.includes(friend._id)}
                    onClick={() => handleFollowClick(friend._id)}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      px: 2,
                      py: 0.5,
                      ml: 2,
                      flexShrink: 0,
                    }}
                  >
                    {loadingIds.includes(friend._id) ? "Loading..." : "Follow"}
                  </Button>
                </ListItem>

              ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  pt: 0,
                  color: "text.secondary",
                }}
              >
                No suggestion
              </Typography>
            )}
          </List>
        </Box>
        {showFadeFriends && (
          <Box
            sx={{
              position: "absolute",
              borderRadius: "10px",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              background: "linear-gradient(to top, rgba(245,245,245,1), rgba(245,245,245,0))",
              pointerEvents: "none",
              transition: "opacity 0.3s ease",
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
