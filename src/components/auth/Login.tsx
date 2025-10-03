import {
  Container,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Link,
  alpha,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import useInput from "../hooks/use-input";
import { connectSocket, registerUser } from "../../socket";

const emailOrUsernameValidation = (input: string): boolean => {
  const trimmedInput = input.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernamePattern = /^[A-Za-z][A-Za-z0-9._]{2,}$/;

  return emailPattern.test(trimmedInput) || usernamePattern.test(trimmedInput);
};

const passwordInputValidation = (inputValue: string) => {
  return inputValue.trim().length >= 4;
};

const Login = () => {
  // Password visibility state
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Email / Username input hook
  const {
    value: emailValue,
    hasError: emailError,
    blurHandler: emailBlurHandler,
    inputHandler: emailInputHandler,
    reset: emailReset,
    isValid: emailIsValid,
  } = useInput(emailOrUsernameValidation);

  // Password input hook
  const {
    value: passwordValue,
    hasError: passwordError,
    blurHandler: passwordBlurHandler,
    inputHandler: passwordInputHandler,
    reset: passwordReset,
    isValid: passwordIsValid,
  } = useInput(passwordInputValidation);

  let isFormValid = false;
  if (passwordIsValid && emailIsValid) {
    isFormValid = true;
  }

  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: emailValue,
          password: passwordValue,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong";

        try {
          const errorData = await response.json();
        
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((err: any) => `${err.field}: ${err.message}`)
              .join(" | ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = "Server returned an unexpected error";
        }

        dispatch(
          alertActions.showAlert({ severity: "error", message: errorMessage })
        );
        return;
      }

      const data = await response.json();
      console.log(data);
      dispatch(authActions.login(data.user));

      emailReset();
      passwordReset();

      // ----------------------
      // REGISTER SOCKET HERE
      // ----------------------
      if (data.user && data.user._id) {
        connectSocket();// Establish connection only after login
        registerUser(); // Register the user
      }

      navigate("/", { replace: true });
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
        {/* Logo / Title */}
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

        {/* Login Card */}
        <Card
          sx={(theme) => ({
            width: "100%",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle soft shadow
            border: `2px solid ${theme.palette.primary.main}`, // Primary color border
            borderRadius: "16px", // Rounded edges
            p: 4, // Space inside the border
            backgroundColor: "transparent", // Keep transparent to show app background
          })}
        >
          <CardContent>
            <form onSubmit={formSubmitHandler}>
              <TextField
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "25px",
                  mt: 1, // extra margin top for better spacing
                }}
                value={emailValue}
                error={!!emailError}
                fullWidth
                label="Username or Email"
                margin="normal"
                onChange={emailInputHandler}
                onBlur={emailBlurHandler}
              />
              {!!emailError && (
                <Typography color="error" variant="caption">
                  Invalid username or email *
                </Typography>
              )}

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
                type={showPassword ? "text" : "password"} // Toggle between password and text
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!isFormValid}
                sx={(theme) => ({
                  mt: 4,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "25px",
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
                Login
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signup Footer */}
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
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                sx={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
