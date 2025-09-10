import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Avatar,
} from "@mui/material";

export default function SuggestedFriend() {
  // Explicitly type the refs for scrollable containers
  const friendsScrollRef = useRef<HTMLDivElement | null>(null);

  // State to control fade visibility
  const [showFadeFriends, setShowFadeFriends] = useState<boolean>(true);

  /**
   * Generic scroll handler to detect bottom and hide fade effect
   */
  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setShowFade: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const element = ref.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;

    // If scrolled to bottom, hide fade
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      setShowFade(false);
    } else {
      setShowFade(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "800px",
        borderLeft: "1px solid #eee",
        overflow: "hidden",
        borderRadius: "10px",
      }}
    >
      {/* ---- TOP SECTION: Suggested Friends ---- */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          position: "relative", // Required for fade positioning
        }}
      >
        {/* Sticky Heading */}
        <Box
          sx={{
            p: 2,
            pb: 0,
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
          <hr style={{ color: "gray" }} />
        </Box>

        {/* Scrollable List */}
        <Box
          ref={friendsScrollRef}
          onScroll={() => handleScroll((friendsScrollRef as any), setShowFadeFriends)}
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            px: 2,
            pb: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <List sx={{ p: 0 }}>
            {Array.from({ length: 15 }, (_, i) => (
              <ListItem
                key={i}
                sx={{
                  py: 1,
                  px: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2, // Adds breathing room for responsiveness
                }}
              >
                {/* Avatar + Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1, // Takes available space naturally
                    minWidth: 0, // Prevents overflow in small widths
                  }}
                >
                  <Avatar
                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    sx={{ width: 44, height: 44 }}
                  />
                  <Box sx={{ overflow: "hidden" }}>
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
                      Friend {i + 1}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      New to platform
                    </Typography>
                  </Box>
                </Box>

                {/* Follow Button */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    ml: 2, // Space between text block and button
                    flexShrink: 0, // Prevent button from shrinking
                  }}
                >
                  Follow
                </Button>
              </ListItem>

            ))}
          </List>
        </Box>

        {/* Fade Effect */}
        {showFadeFriends && (
          <Box
            sx={{
              position: "absolute",
              borderRadius: "10px",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              background:
                "linear-gradient(to top, rgba(250,250,250,1), rgba(250,250,250,0))",
              pointerEvents: "none",
              transition: "opacity 0.3s ease",
            }}
          />
        )}
      </Paper>

    </Box>
  );
};