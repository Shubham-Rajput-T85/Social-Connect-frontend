import React, { useEffect, useState } from "react";
import {
  Modal,
  Paper,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../../api/endpoints";
import { alertActions } from "../../store/alert-slice";
import Loader from "../../ui/Loader";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following"; // determines which list to fetch
}

interface IUser {
  _id: string;
  username: string;
  profileUrl?: string;
}

const FollowModal: React.FC<Props> = ({ open, onClose, userId, type }) => {
  const [list, setList] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) return;

    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/user/get${type === "followers" ? "Followers" : "Following"}?userId=${userId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Failed to fetch ${type}`);
        setList(type === "followers" ? data.followersList.followers : data.followingList.following || []);
      } catch (error: any) {
        dispatch(
          alertActions.showAlert({
            severity: "error",
            message: error.message || `Error fetching ${type}`,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [open, userId, type, dispatch]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" } },
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Paper sx={{ width: "90%", maxWidth: 500, maxHeight: "80%", p: 3, overflowY: "auto", position: "relative" }}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 16, right: 16 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" fontWeight={600} mb={2}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ maxHeight: 300, overflowY: "auto" }}>
          {loading ? (
            <Loader/>
          ) : list.length > 0 ? (
            list.map((user) => (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <Avatar src={user.profileUrl ? `${BASE_URL}${user.profileUrl}` : undefined}>
                    {user.username?.[0].toUpperCase() || "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              {type === "followers" ? "No followers yet" : "Not following anyone"}
            </Typography>
          )}
        </List>
      </Paper>
    </Modal>
  );
};

export default FollowModal;
