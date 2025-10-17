import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_URL } from "../../api/endpoints";

interface Viewer {
  _id: string;
  username: string;
  name: string;
  profileUrl?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  viewers: Viewer[];
}

const ViewersListModal: React.FC<Props> = ({ open, onClose, viewers }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          width: 350,
          mx: "auto",
          mt: 10,
          p: 2,
          boxShadow: 4,
          position: "relative",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 5, right: 5 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" mb={2}>
          Viewers ({viewers.length})
        </Typography>

        {viewers.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No one has viewed yet
          </Typography>
        ) : (
          <List>
            {viewers.map((viewer) => (
              <ListItem key={viewer._id}>
                <ListItemAvatar>
                  <Avatar src={`${BASE_URL}${viewer.profileUrl}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={viewer.name}
                  secondary={`@${viewer.username}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default ViewersListModal;
