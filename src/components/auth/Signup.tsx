import {
  Container,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Link,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Close as CloseIcon } from "@mui/icons-material";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";
import useInput from "../hooks/use-input";
import { alpha } from "@mui/material/styles";

// Validation functions
const nameInputValidation = (inputValue: string) => {
  return inputValue.trim() !== "" && /^[A-Za-z ]+$/.test(inputValue.trim());
};

const emailInputValidation = (emailInput: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(emailInput) && emailInput.trim() !== "";
};

const usernameInputValidation = (usernameInput: string) => {
  const pattern = /^[A-Za-z][A-Za-z0-9._]{2,}$/; // Starts with a letter, 3+ chars total
  return pattern.test(usernameInput.trim());
};

const passwordInputValidation = (inputValue: string) => {
  return inputValue.trim().length >= 4;
};

const bioInputValidation = (inputValue: string) => {
  return inputValue.trim().length <= 150; // max 150 chars
};

const Signup = () => {
  // Password visibility state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  } = useInput(nameInputValidation);

  const {
    value: emailValue,
    hasError: emailError,
    blurHandler: emailBlurHandler,
    inputHandler: emailInputHandler,
    reset: emailReset,
    isValid: emailIsValid,
  } = useInput(emailInputValidation);

  const {
    value: usernameValue,
    hasError: usernameError,
    blurHandler: usernameBlurHandler,
    inputHandler: usernameInputHandler,
    reset: usernameReset,
    isValid: usernameIsValid,
  } = useInput(usernameInputValidation);

  const {
    value: passwordValue,
    hasError: passwordError,
    blurHandler: passwordBlurHandler,
    inputHandler: passwordInputHandler,
    reset: passwordReset,
    isValid: passwordIsValid,
  } = useInput(passwordInputValidation);

  const {
    value: bioValue,
    hasError: bioError,
    blurHandler: bioBlurHandler,
    inputHandler: bioInputHandler,
    reset: bioReset,
    isValid: bioIsValid,
  } = useInput(bioInputValidation);

  // Form validation
  const isFormValid =
    nameIsValid && emailIsValid && usernameIsValid && passwordIsValid && bioIsValid;

  // Profile picture change handler (with fix for same file re-upload)
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));

    // **Reset the input value so selecting the same file again triggers onChange**
    event.target.value = "";
  };

  // Clear profile picture
  const handleClearProfilePic = () => {
    setProfilePic(null);
    setPreviewUrl(null);
  };

  // Form submit handler
  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", nameValue.trim());
      formData.append("email", emailValue.trim());
      formData.append("username", usernameValue.trim());
      formData.append("password", passwordValue.trim());
      formData.append("bio", bioValue.trim());
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          if (errorData.data && Array.isArray(errorData.data)) {
            errorMessage = errorData.data
              .map((err: any) => `${err.field}: ${err.message}`)
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
      emailReset();
      passwordReset();
      nameReset();
      usernameReset();
      bioReset();
      setProfilePic(null);
      setPreviewUrl(null);

      navigate("/login", { replace: true });
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: "algerian",
            textAlign: "center",
            color: "primary.main",
            mb: 4,
          }}
        >
          SocialConnect
        </Typography>

        {/* Signup Form */}
        <Card
          sx={{
            width: "100%",
            boxShadow: 2,
            borderRadius: 2,
            p: 2,
          }}
        >
          <CardContent>
            <form onSubmit={formSubmitHandler}>
              {/* Name */}
              <TextField
                sx={{ backgroundColor: "#ffffff", borderRadius: "25px" }}
                value={nameValue}
                error={!!nameError}
                fullWidth
                label="Full Name"
                margin="normal"
                onChange={nameInputHandler}
                onBlur={nameBlurHandler}
              />
              {nameError && (
                <Typography color="error" variant="caption">
                  Name must only contain letters *
                </Typography>
              )}

              {/* Email */}
              <TextField
                sx={{ backgroundColor: "#ffffff", borderRadius: "25px" }}
                value={emailValue}
                error={!!emailError}
                fullWidth
                label="Email"
                margin="normal"
                onChange={emailInputHandler}
                onBlur={emailBlurHandler}
              />
              {emailError && (
                <Typography color="error" variant="caption">
                  Invalid email address *
                </Typography>
              )}

              {/* Username */}
              <TextField
                sx={{ backgroundColor: "#ffffff", borderRadius: "25px" }}
                value={usernameValue}
                error={!!usernameError}
                fullWidth
                label="Username"
                margin="normal"
                onChange={usernameInputHandler}
                onBlur={usernameBlurHandler}
              />
              {usernameError && (
                <Typography color="error" variant="caption">
                  Username must start with a letter and be at least 3 characters *
                </Typography>
              )}

              {/* Password */}
              <TextField
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "25px",
                  mt: 2,
                }}
                value={passwordValue}
                error={!!passwordError}
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                onChange={passwordInputHandler}
                onBlur={passwordBlurHandler}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {passwordError && (
                <Typography color="error" variant="caption">
                  Password must be at least 4 characters *
                </Typography>
              )}

              {/* Bio */}
              <TextField
                sx={{ backgroundColor: "#ffffff", borderRadius: "25px" }}
                value={bioValue}
                error={!!bioError}
                fullWidth
                label="Bio"
                multiline
                rows={3}
                margin="normal"
                onChange={bioInputHandler}
                onBlur={bioBlurHandler}
                helperText={`${bioValue.length}/150`}
              />

              {/* Profile Picture Upload Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfilePicChange}
                  />
                </Button>

                {/* Preview with Cross Button */}
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

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
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
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Footer */}
        <Card
          sx={{
            width: "100%",
            mt: 2,
            boxShadow: 2,
            borderRadius: 2,
            p: 2,
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              Have an account?{" "}
              <Link
                component="button"
                variant="body2"
                sx={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;
