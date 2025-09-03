import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react'

interface SnackbarAlertProps {
    severity: AlertColor;       // required
    message: string;            // required
    onClose: () => void;        // required
    duration?: number;          // optional, default 3000
  }

const SnackbarAlert:React.FC<SnackbarAlertProps> = (props) => {
    const severity = props.severity || "";
    const message = props.message || "";
    return (
        <Snackbar
            open={!!message}
            autoHideDuration={3000}
            onClose={props.onClose || null}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarAlert