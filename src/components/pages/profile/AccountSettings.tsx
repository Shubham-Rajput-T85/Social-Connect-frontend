// components/AccountSettings.tsx
import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from "../../store/alert-slice";
import { authActions } from "../../store/auth-slice";
import { userService } from "../../../api/services/user.service";

interface DeleteResponse {
    success: boolean;
    message: string;
}

const AccountSettings: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.auth.user);

    // Handle Privacy Toggle
    const handleTogglePrivacy = async () => {
        try {
            setLoading(true);
            const updatedUser = await userService.toggleAccountStatus();
            console.log("update after db: ", updatedUser);

            // Update Redux state with new isPrivate value
            dispatch(authActions.updateUserPrivacyStatus(updatedUser.data.isPrivate));

            dispatch(
                alertActions.showAlert({
                    severity: "info",
                    message: `Account is now ${updatedUser.data.isPrivate ? "Private" : "Public"}`,
                })
            );
        } catch (error) {
            if (error instanceof Error) {
                dispatch(
                    alertActions.showAlert({
                        severity: "error",
                        message: error.message,
                    })
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Account Deletion
    const handleDeleteAccount = async (): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8080/user/delete?userId=${user._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData: DeleteResponse = await response.json();
                throw new Error(errorData.message || "Failed to delete account");
            }

            const data: DeleteResponse = await response.json();
            console.log(data.message);

            // Clear local storage
            localStorage.removeItem("token");

            dispatch(
                alertActions.showAlert({ severity: "success", message: "Account deleted successfully" })
            );

            navigate("/login");
        } catch (error) {
            if (error instanceof Error) {
                dispatch(
                    alertActions.showAlert({ severity: "error", message: error.message })
                );
            }
        }
    };

    return (
        <Card
        sx={(theme) => ({
        //   width: "100%",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle soft shadow
          border: `2px solid ${theme.palette.primary.main}`, // Primary color border
          borderRadius: "16px", // Rounded edges
          p: 2, // Space inside the border
          backgroundColor: "transparent", // Keep transparent to show app background
        })}
      >
            {/* Account Status Section */}
            <Typography variant="h6" mb={2}>
                Account Status
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    p: 2,
                    mb: 3,
                }}
            >
                <Typography>
                    {user?.isPrivate ? "Private" : "Public"}
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={user?.isPrivate || false}
                            onChange={handleTogglePrivacy}
                            disabled={loading}
                            color="primary"
                        />
                    }
                    label={loading ? "Updating..." : ""}
                />
            </Box>

            {/* Danger Zone Section */}
            <Typography variant="h6" mb={2}>
                Danger Zone
            </Typography>

            <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(true)}
            >
                Delete Account
            </Button>

            {/* Confirmation Dialog */}
            <Dialog open={open}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to <b>delete</b> your account? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, pr: 2 }}>
                    <Button color="success" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="outlined"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            </Card>
    );
};

export default AccountSettings;
