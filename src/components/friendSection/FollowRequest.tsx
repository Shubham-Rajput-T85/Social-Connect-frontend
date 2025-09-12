import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";

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

  const handleAction = async (action: "accept" | "reject", targetUserId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/user/${action}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, currentUserId }),
      });

      const data = await res.json();
      console.log(data);
      
      if (!res.ok) throw new Error(data.message || `${action} request failed`);

      setRequests((prev) => prev.filter((req) => req._id !== targetUserId));

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
    fetchFollowRequests();
  }, []);

  return (
    <Box sx={{ borderLeft: "1px solid #eee", borderRadius: 2, p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Follow Requests
      </Typography>
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
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleAction("reject", user._id)}
                >
                  Reject
                </Button>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
            No follow requests
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default FollowRequest;
