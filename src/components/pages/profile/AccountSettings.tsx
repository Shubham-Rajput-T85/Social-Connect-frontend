import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { alertActions } from "../../store/alert-slice";
import { useDispatch } from "react-redux";

interface DeleteResponse {
    success: boolean;
    message: string;
}

const AccountSettings: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();

    const handleDeleteAccount = async (): Promise<void> => {
        try {

            const response = await fetch(`http://localhost:8080/user/delete?userId=${user._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });

            console.log("here");

            if (!response.ok) {
                const errorData: DeleteResponse = await response.json();
                throw new Error(errorData.message || "Failed to delete account");
            }

            // If success
            const data: DeleteResponse = await response.json();
            console.log(data.message);

            // Clear local storage
            localStorage.removeItem("token");

            dispatch(
                alertActions.showAlert({ severity: "success", message: "account deleted successfully" })
            );

            // Redirect to login
            navigate("/login");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error deleting account:", error.message);
                dispatch(
                    alertActions.showAlert({ severity: "error", message: error.message })
                );
            } else {
                console.error("Unknown error occurred while deleting account");
            }
        }
    };

    return (
        <Box>
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
            <Dialog open={open}
            //   onClose={() => setOpen(false)}
            >
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
        </Box>
    );
};

export default AccountSettings;
