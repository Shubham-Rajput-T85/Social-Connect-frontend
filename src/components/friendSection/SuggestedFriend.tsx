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
  ButtonProps,
} from "@mui/material";
import { userService } from "../../api/services/user.service";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../../api/endpoints";
import { alertActions } from "../store/alert-slice";
import { authActions } from "../store/auth-slice";

interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  profileUrl?: string;
}

type FollowState = "Follow" | "Requested" | "Following" | "Follow Back";

const SuggestedFriend = () => {
  const dispatch = useDispatch();
  const [suggestedFriends, setSuggestedFriends] = useState<SuggestedUser[]>([]);
  const [followStates, setFollowStates] = useState<Record<string, FollowState>>({});
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [showFadeFriends, setShowFadeFriends] = useState(true);

  const friendsScrollRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useSelector((state: any) => state.auth?.user?._id);

  // Fetch suggested users and their follow states
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await userService.getSuggestedFriends();
        const users = res?.users ?? [];
        setSuggestedFriends(users);

        if (!currentUserId) return;

        const states: Record<string, FollowState> = {};
        for (const user of users) {
          try {
            const followRes = await fetch(
              `http://localhost:8080/user/followState?currentUserId=${currentUserId}&targetUserId=${user._id}`,
              { credentials: "include" }
            );
            const data = await followRes.json();
            states[user._id] = (data?.state as FollowState) ?? "Follow";
          } catch {
            states[user._id] = "Follow";
          }
        }
        setFollowStates(states);
      } catch (err) {
        console.error("Failed to fetch suggested friends:", err);
      }
    };

    fetchSuggested();
  }, [currentUserId]);

  useEffect(() => {
    const el = friendsScrollRef.current;
    if (el) setShowFadeFriends(el.scrollHeight > el.clientHeight);
  }, [suggestedFriends]);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const el = ref.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setShow(!(scrollTop + clientHeight >= scrollHeight - 2));
  };

  const handleFollowClick = async (targetUserId: string) => {
    if (!currentUserId) {
      dispatch(alertActions.showAlert({ severity: "error", message: "You must be logged in" }));
      return;
    }

    const currentState = (followStates[targetUserId] as FollowState) || "Follow";
    setLoadingIds((prev) => [...prev, targetUserId]);

    try {
      let url = "";
      let successMessage = "";

      if (currentState === "Follow" || currentState === "Follow Back") {
        url = "http://localhost:8080/user/follow";
        successMessage = "Follow request sent";
      } else if (currentState === "Following") {
        url = "http://localhost:8080/user/unfollow";
        successMessage = "Unfollowed";
      } else if (currentState === "Requested") {
        url = "http://localhost:8080/user/cancel";
        successMessage = "Cancelled request";
      }

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId, targetUserId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Follow action failed");

      const newState = (data?.currentState as FollowState) || "Follow";
      setFollowStates((prev) => ({ ...prev, [targetUserId]: newState }));

      if (newState === "Following") {
        dispatch(authActions.incrementFollowingUserCount());
      } else if ((newState === "Follow" || newState === "Follow Back") && currentState === "Following") {
        dispatch(authActions.decrementFollowingUserCount());
      }

      dispatch(alertActions.showAlert({ severity: "info", message: successMessage }));
    } catch (err: any) {
      dispatch(alertActions.showAlert({ severity: "error", message: err?.message || "Action failed" }));
    } finally {
      setLoadingIds((p) => p.filter((id) => id !== targetUserId));
    }
  };

  const getButtonProps = (state: FollowState): Pick<ButtonProps, "variant" | "color"> => {
    switch (state) {
      case "Follow":
        return { variant: "contained", color: "primary" };
      case "Requested":
        return { variant: "outlined", color: "secondary" };
      case "Following":
        return { variant: "outlined", color: "primary" };
      case "Follow Back":
        return { variant: "contained", color: "secondary" };
      default:
        return { variant: "contained", color: "primary" };
    }
  };

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
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            pb: 2,
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 2,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Suggested Friends
          </Typography>
        </Box>

        <hr style={{ color: "gray", margin: "10px", marginTop: 0 }} />

        {/* Scrollable List */}
        <Box
          ref={friendsScrollRef}
          onScroll={() => handleScroll(friendsScrollRef as any, setShowFadeFriends)}
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <List sx={{ p: 0 }}>
            {suggestedFriends.length > 0 ? (
              suggestedFriends.map((friend) => {
                const state = (followStates[friend._id] as FollowState) || "Follow";
                const isLoading = loadingIds.includes(friend._id);
                const btnProps = getButtonProps(state);

                return (
                  <ListItem
                    key={friend._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "nowrap",
                    }}
                  >
                    {/* Avatar + Name */}
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
                        src={friend.profileUrl ? `${BASE_URL}${friend.profileUrl}` : ""}
                        sx={{ width: 44, height: 44, flexShrink: 0 }}
                      >
                        {(friend.username?.[0] || "U").toUpperCase()}
                      </Avatar>

                      <Box
                        sx={{
                          overflow: "hidden",
                          minWidth: 0,
                          flex: 1,
                          maxWidth: "70px",
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

                    {/* Follow Button */}
                    <Box sx={{ flexShrink: 0 }}>
                      <Button
                        variant={btnProps.variant}
                        color={btnProps.color}
                        size="small"
                        onClick={() => handleFollowClick(friend._id)}
                        disabled={isLoading}
                        sx={{ minWidth: 36, px: 1, textTransform: "none", fontSize: "0.75rem" }}
                      >
                        {isLoading ? "..." : state}
                      </Button>
                    </Box>
                  </ListItem>
                );
              })
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  p: 2,
                  pt: 0,
                  color: "text.secondary",
                }}
              >
                No suggestions
              </Typography>
            )}
          </List>
        </Box>

        {/* Fade effect */}
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
};

export default SuggestedFriend;
