import React, { FormEvent, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Card,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alpha } from "@mui/material/styles";
import useInput from "../../hooks/use-input";
import { alertActions } from "../../store/alert-slice";
import { useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";


// Validation functions
const nameInputValidation = (inputValue: string) => {
  return inputValue.trim() !== "" && /^[A-Za-z ]+$/.test(inputValue.trim());
};

const usernameInputValidation = (usernameInput: string) => {
  const pattern = /^[A-Za-z][A-Za-z0-9._]{2,}$/; // Starts with a letter, 3+ chars total
  return pattern.test(usernameInput.trim());
};

const bioInputValidation = (inputValue: string) => {
  return inputValue.trim().length <= 150; // max 150 chars
};


const GeneralSettingsForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user: any = useSelector((state: any) => state.auth.user);

  // State for profile picture
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Inputs using custom hook
  const {
    value: nameValue,
    hasError: nameError,
    blurHandler: nameBlurHandler,
    inputHandler: nameInputHandler,
    reset: nameReset,
    isValid: nameIsValid,
  } = useInput(nameInputValidation, user.name);

  const {
    value: usernameValue,
    hasError: usernameError,
    blurHandler: usernameBlurHandler,
    inputHandler: usernameInputHandler,
    reset: usernameReset,
    isValid: usernameIsValid,
  } = useInput(usernameInputValidation, user.username);

  const {
    value: bioValue,
    hasError: bioError,
    blurHandler: bioBlurHandler,
    inputHandler: bioInputHandler,
    reset: bioReset,
    isValid: bioIsValid,
  } = useInput(bioInputValidation, user.bio);

  let isFormValid = false;
  // Form validation
  if (nameIsValid
    && usernameIsValid
    && bioIsValid
  ) {
    isFormValid = true;
  }

  // Profile picture change handler
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));

    // **Reset the input value so selecting the same file again triggers onChange**
    event.target.value = "";
  };

  const handleClearProfilePic = () => {
    setProfilePic(null);
    setPreviewUrl(null);
  };

  // Form submit handler
  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (!user._id) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "User not logged in!",
        })
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", user._id);
      formData.append("name", nameValue.trim());
      formData.append("username", usernameValue.trim());
      formData.append("bio", bioValue.trim());
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const response = await fetch("http://localhost:8080/user/updateUserProfile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      console.log("here");

      if (!response.ok) {
        let errorMessage = "Something went wrong while user update";
        try {
          const errorData = await response.json();
          if (errorData.data && Array.isArray(errorData.data)) {
            errorMessage = errorData.data
              .map((err: any) => `${err.path}: ${err.msg}`)
              .join(" | ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = "Server returned an unexpected error";
        }

        dispatch(alertActions.showAlert({ severity: "error", message: errorMessage }));
        return;
      }

      // Success
      // nameReset();
      // usernameReset();
      // bioReset();
      setProfilePic(null);
      setPreviewUrl(null);


      const data = await response.json();

      // Update redux state directly without page reload
      dispatch(authActions.setUser(data.user));

      dispatch(
        alertActions.showAlert({
          severity: "success",
          message: "Profile updated successfully!",
        })
      );

      // navigate("/", { replace: true });
    } catch (error) {
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "Network error: " + error,
        })
      );
    }
  };

  return (
    <Card
      sx={(theme) => ({
        // width: "100%",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle soft shadow
        border: `2px solid ${theme.palette.primary.main}`, // Primary color border
        borderRadius: "16px", // Rounded edges
        p: 2, // Space inside the border
        backgroundColor: "transparent", // Keep transparent to show app background
      })}
    >
      <form onSubmit={formSubmitHandler}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          General Settings
        </Typography>

        {/* Name */}
        <TextField
          value={nameValue}
          error={!!nameError}
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          onChange={nameInputHandler}
          onBlur={nameBlurHandler}
        />
        {nameError && (
          <Typography color="error" variant="caption" component="span">
            Name must only contain letters *
          </Typography>
        )}

        {/* Username */}
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={usernameValue}
          error={!!usernameError}
          margin="normal"
          onChange={usernameInputHandler}
          onBlur={usernameBlurHandler}
        />
        {usernameError && (
          <Typography color="error" variant="caption" component="span">
            Username must start with a letter and be at least 3 characters *
          </Typography>
        )}

        {/* Bio */}
        <TextField
          value={bioValue}
          error={!!bioError}
          fullWidth
          multiline
          rows={3}
          label="Bio"
          variant="outlined"
          margin="normal"
          onChange={bioInputHandler}
          onBlur={bioBlurHandler}
          helperText={`${bioValue.length}/150`}
        />

        {/* Profile Picture */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button variant="outlined" component="label">
            Upload Picture
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePicChange}
            />
          </Button>
          {previewUrl && (
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <Avatar
                src={previewUrl}
                alt="Profile Preview"
                sx={{ width: 56, height: 56 }}
              />

              {/* Cross Button */}
              <IconButton
                onClick={handleClearProfilePic}
                size="small"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Button type="submit" variant="contained" fullWidth
          disabled={!isFormValid}
          sx={(theme) => ({
            mt: 3,
            textTransform: "none",
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            "&.Mui-disabled": {
              backgroundColor: alpha(theme.palette.primary.main, 0.4),
              color: alpha("#fff", 0.7),
            },
          })}
        >
          Save Changes
        </Button>
      </form>
    </Card>
  );
};

export default GeneralSettingsForm;
