import React, { useState } from "react";
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { BASE_URL } from "../../api/endpoints";
import { useSelector } from "react-redux";

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
  storyOwnerId?: string;
  onDeleteStory?: () => void;
}

const ViewersListModal: React.FC<Props> = ({
  open,
  onClose,
  viewers,
  storyOwnerId,
  onDeleteStory,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const currentUserId = useSelector((state: any) => state.auth.user._id);

  const menuOpen = Boolean(anchorEl);

  // Menu Handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Delete flow handlers
  const handleDeleteClick = () => {
    handleMenuClose();
    setConfirmOpen(true); // open confirm dialog
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDeleteStory?.(); // trigger deletion from parent
  };

  return (
    <>
      {/* Main Modal */}
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "20px",
            width: { xs: "90%", sm: 500 },
            mx: "auto",
            mt: 10,
            p: 3,
            boxShadow: 6,
            position: "relative",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Menu Icon for Delete (only for owner) */}
          {currentUserId === storyOwnerId && (
            <IconButton
              onClick={handleMenuClick}
              sx={{ position: "absolute", top: 10, right: 50 }}
            >
              <MoreVertIcon />
            </IconButton>
          )}

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleDeleteClick} sx={{ color: "red" }}>
              Delete Story
            </MenuItem>
          </Menu>

          {/* Title */}
          <Typography
            variant="h6"
            textAlign="center"
            mb={2}
            sx={{ fontWeight: 600 }}
          >
            Viewers ({viewers.length})
          </Typography>

          {/* Viewers List */}
          {viewers.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              No one has viewed this story yet.
            </Typography>
          ) : (
            <List>
              {viewers.map((viewer) => (
                <ListItem key={viewer._id} sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        viewer.profileUrl
                          ? `${BASE_URL}${viewer.profileUrl}`
                          : undefined
                      }
                      alt={viewer.name}
                    />
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

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Story?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this story? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewersListModal;
