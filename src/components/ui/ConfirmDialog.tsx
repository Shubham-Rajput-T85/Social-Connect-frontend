import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  color?: "error" | "primary" | "info";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  color = "error",
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    PaperProps={{
      sx: { borderRadius: "20px", p: 1.5 },
    }}
  >
    <DialogTitle>{title}</DialogTitle>
    {description && (
      <DialogContent>
        <Typography variant="body2">{description}</Typography>
      </DialogContent>
    )}
    <DialogActions>
      <Button onClick={onCancel} color="inherit" sx={{ border: 1 }}>
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        color={color}
        variant="contained"
        disabled={loading}
      >
        {loading ? "Processing..." : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
