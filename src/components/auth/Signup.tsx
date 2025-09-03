import { Container, Box, Button, TextField, Card, CardContent, Typography } from "@mui/material";
import React, { FormEvent } from 'react';

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alertActions } from "../store/alert-slice";
import useInput from "../hooks/use-input";


const emailInputValidation = (emailInput: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(emailInput) && emailInput.trim() !== "";
}

const passwordInputValidation = (inputValue: string) => {
  return inputValue.trim().length >= 4;
}

const nameInputValidation = (inputValue: string) => {
  return inputValue.trim() !== "" && /^[A-Za-z ]+$/.test(inputValue.trim());
}

const Signup = () => {
  const navigate = useNavigate();
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
    value: passwordValue,
    hasError: passwordError,
    blurHandler: passwordBlurHandler,
    inputHandler: passwordInputHandler,
    reset: passwordReset,
    isValid: passwordIsValid,
  } = useInput(passwordInputValidation);

  const dispatch = useDispatch();

  let isFormValid = false;
  if (!passwordIsValid && !emailIsValid && !nameIsValid) {
    isFormValid = true;
  }

  let nameErrorProp = !!nameError;
  let emailErrorProp = !!emailError;
  let passwordErrorProp = !!passwordError;

  let nameHelperText = "name must only have characters";
  let emailHelperText = "email is invalid";
  let passwordHelperText = "password must have atleast 5 characters";

  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/signup",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: nameValue.trim(),
            email: emailValue,
            password: passwordValue
          })
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

      // const data = await response.json();
      // console.log("Signup success:", data);
      emailReset();
      passwordReset();
      nameReset();
      navigate("/login", { replace: true });
    }
    catch (error) {
      dispatch(alertActions.showAlert({ severity: "error", message: "Network error: Something went wrong" + error }));
    }
  };

  return (
    <>
      {/* Signup Form here */}

      {/* <SnackbarAlert severity="error" onClose={() => setServerError("")} message = { serverError }  /> */}
      <Container maxWidth="sm" sx={{ marginTop: "-80px" }}>
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>Sign Up page</Typography>
          <Card>
            <CardContent>
              <form onSubmit={formSubmitHandler}>
                <TextField value={nameValue} error={nameErrorProp} helperText={nameErrorProp ? nameHelperText : ""} fullWidth label="Name" margin="normal" onChange={nameInputHandler} onBlur={nameBlurHandler} />
                <TextField value={emailValue} error={emailErrorProp} helperText={emailErrorProp ? emailHelperText : ""} fullWidth label="Email" margin="normal" onChange={emailInputHandler} onBlur={emailBlurHandler} />
                <TextField value={passwordValue} error={passwordErrorProp} helperText={passwordErrorProp ? passwordHelperText : ""} fullWidth label="Password" type="password" margin="normal" onChange={passwordInputHandler} onBlur={passwordBlurHandler} />
                <Button type="submit" variant="contained" size="large" disabled={!isFormValid}>Sign up</Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  )
}

export default Signup