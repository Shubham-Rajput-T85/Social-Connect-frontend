import { Container, Box, Button, TextField, Card, CardContent, Typography } from "@mui/material";
import React, { FormEvent } from 'react';
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import useInput from "../hooks/use-input";

// const emailInputValidation = (emailInput: string) => {
//     // const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // return pattern.test(emailInput) && emailInput.trim() !== "";
//     return emailInput.trim() !== "";
// }

const emailOrUsernameValidation = (input: string): boolean => {
  const trimmedInput = input.trim();

  // Regex for validating email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Username rules:
  // - At least 3 characters
  // - Letters, numbers, underscore, or dot allowed
  const usernamePattern = /^[A-Za-z][A-Za-z0-9._]{2,}$/;

  // Valid if input matches either email OR username rules
  return emailPattern.test(trimmedInput) || usernamePattern.test(trimmedInput);
};

const passwordInputValidation = (inputValue: string) => {
    return inputValue.trim().length >= 4;
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        value: emailValue,
        hasError: emailError,
        blurHandler: emailBlurHandler,
        inputHandler: emailInputHandler,
        reset: emailReset,
        isValid: emailIsValid,
    } = useInput(emailOrUsernameValidation);

    const {
        value: passwordValue,
        hasError: passwordError,
        blurHandler: passwordBlurHandler,
        inputHandler: passwordInputHandler,
        reset: passwordReset,
        isValid: passwordIsValid,
    } = useInput(passwordInputValidation);

    let isFormValid = false;
    if (!passwordIsValid && !emailIsValid) {
        isFormValid = true;
    }

    let passwordErrorProp = !!passwordError;
    let emailErrorProp = !!emailError;

    let emailHelperText = "email is invalid";
    let passwordHelperText = "password must have atleast 5 characters";

    const formSubmitHandler = async (event: FormEvent) => {
        event.preventDefault();
        try {
          const response = await fetch("http://localhost:8080/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                usernameOrEmail: emailValue,
                password: passwordValue
              }),
              credentials: "include"
            }
          );
    
          if (!response.ok) {
            let errorMessage = "Something went wrong";
            try {
              const errorData = await response.json();
    
              if (errorData.data && Array.isArray(errorData.data)) {
                // Collect all field-level errors into one string
                errorMessage = errorData.data
                  .map((err: any) => `${err.path}: ${err.msg}`)
                  .join(" | ");
              } else if (errorData.message) {
                // Generic fallback
                errorMessage = errorData.message;
              }
            } catch (e) {
              errorMessage = "Server returned an unexpected error";
            }
    
            dispatch(alertActions.showAlert({ severity: "error", message: errorMessage }));
            return;
          }
    
          const data = await response.json();
          console.log(data);
          dispatch(authActions.login(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
          
          emailReset();
          passwordReset();
          navigate("/", { replace: true });
        }
        catch (error) {
          dispatch(alertActions.showAlert({ severity: "error", message: "Network error: Something went wrong" + error }));
        }
      };

    return (
        <>
            <Container maxWidth="sm" sx={{ marginTop: "-80px" }} >
                <Box sx={{ py: 4 }}>
                    <Typography variant="h4" gutterBottom>Login page</Typography>
                    <Card>
                        <CardContent>
                            <form onSubmit={formSubmitHandler}>
                                <TextField value={emailValue} error={emailErrorProp} helperText={ emailErrorProp ? emailHelperText : "" } fullWidth label="Email" margin="normal" onChange={emailInputHandler} onBlur={emailBlurHandler} />
                                <TextField value={passwordValue} error={passwordErrorProp} helperText={ passwordErrorProp ? passwordHelperText : "" } fullWidth label="Password" type="password" margin="normal" onChange={passwordInputHandler} onBlur={passwordBlurHandler} />
                                <Button type="submit" variant="contained" size="large" disabled={!isFormValid}>Login</Button>
                            </form>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </>
    )
}

export default Login