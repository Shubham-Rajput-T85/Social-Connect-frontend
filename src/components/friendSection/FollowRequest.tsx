import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Button,
  Paper,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

interface IFollowRequest {
  _id: string;
  username: string;
  name: string;
  email: string;
  profileUrl?: string;
}

interface FollowRequestProps {
  currentUserId: string;
}

const FollowRequest: React.FC<FollowRequestProps> = ({ currentUserId }) => {
  const [requests, setRequests] = useState<IFollowRequest[]>([]);
  const dispatch = useDispatch();
  // Explicitly type the refs for scrollable containers
  const requestScrollRef = useRef<HTMLDivElement | null>(null);

  // State to control fade visibility
  const [showFadeRequest, setShowFadeRequest] = useState<boolean>(true);

  useEffect(() => {
    const element = requestScrollRef.current;
    if (element) {
      // Show fade only if scrolling is possible
      setShowFadeRequest(element.scrollHeight > element.clientHeight);
    }
  }, [requests]); 
  

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

  
  const handleAction = async (action: "accept" | "reject", requesterUserId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/user/${action}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterUserId, targetUserId: currentUserId }),     // here requesterUserId is id who created request, currentUserId is target Id which will accept|reject request
      });
      
      const data = await res.json();
      console.log(data);
      
      if (!res.ok) throw new Error(data.message || `${action} request failed`);
      
      setRequests((prev) => prev.filter((req) => req._id !== requesterUserId));
      
      dispatch(
        alertActions.showAlert({
          severity: "success",
          message: data.message,
        })
      );
    } catch (error: any) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: error.message || `Error performing ${action} action`,
        })
      );
    }
  };
  
  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/user/followRequests?userId=${currentUserId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch requests");
        setRequests(data.followRequests.followRequest || []);
      } catch (error: any) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: error.message || "Error fetching follow requests",
          })
        );
      }
    };
    fetchFollowRequests();
  }, [currentUserId, dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "300px",
        borderLeft: "1px solid #eee",
        overflow: "hidden",
        borderRadius: "10px",
        mb: 2
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
            pb: 2,
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 2,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Follow Request
          </Typography>
        </Box>
        <hr style={{ color: "gray", margin:"10px", marginTop:"0" }} />

        {/* Scrollable List */}
        <Box
          ref={requestScrollRef}
          onScroll={() => handleScroll((requestScrollRef as any), setShowFadeRequest)}
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            px: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <List>
            {requests.length > 0 ? (
              requests.map((user) => (
                <ListItem
                  key={user._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={user.profileUrl || ""}
                      sx={{ width: 44, height: 44 }}
                    >
                      {(user.username?.[0] || "U").toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAction("accept", user._id)}
                      
                    >
                      <DoneIcon/>
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleAction("reject", user._id)}
                    >
                      <ClearIcon/>
                    </Button>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", p: 2, pt:0, color: "text.secondary" }}>
                No follow requests
              </Typography>
            )}
          </List>
        </Box>

        {/* Fade Effect */}
        {(showFadeRequest) && (
          <Box
            sx={{
              position: "absolute",
              borderRadius: "10px",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              background:
                "linear-gradient(to top, rgba(245,245,245,1), rgba(245,245,245,0))",
              pointerEvents: "none",
              transition: "opacity 0.3s ease",
            }}
          />
        )}
      </Paper>

    </Box>

  );
};

export default FollowRequest;
