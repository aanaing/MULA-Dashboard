import React, { useState } from "react";
import { useMutation } from "@apollo/client";
// import { LOGIN } from "../gql/auth";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, Alert } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";

import Typography from "@mui/material/Typography";
import icons from "../view/icons";
import "../style/App.css";

const Login = () => {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    phone: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const navigate = useNavigate();

  /*Part of gql */
  // const [postLogin] = useMutation(LOGIN, {
  //   onError: (error) => {
  //     console.log("error : ", error);
  //     setShowAlert({ message: "Error on server", isError: true });
  //     setTimeout(() => {
  //       setShowAlert({ message: "", isError: false });
  //     }, 3000);
  //   },
  //   onCompleted: (result) => {
  //     console.log(result);
  //     setValues({ username: "", password: "", showPassword: false });
  //     setLoading(false);
  //     if (result.AdminLogIn.error) {
  //       //console.log(result.AdminLogIn.error);
  //       setShowAlert({ message: result.AdminLogIn.message, isError: true });
  //       //console.log(result.AdminLogIn.message);
  //       setTimeout(() => {
  //         setShowAlert({ message: "", isError: false });
  //       }, 3000);
  //       return;
  //     }
  //     const decodedToken = jose.decodeJwt(result.AdminLogIn.accessToken);
  //     //console.log(decodedToken);
  //     const data = JSON.stringify({
  //       token: result.AdminLogIn.accessToken,
  //       // userID: decodedToken.hasura['x-hasura-user-id']
  //       userID: decodedToken.user_id,
  //     });
  //     console.log(data);
  //     window.localStorage.setItem("loggedUser", data);
  //     navigate("/");
  //   },
  // });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClick = async () => {
    setErrors({
      username: "",
      password: "",
    });
    setLoading(true);
    let errorExist = false;
    const tempErrors = {};
    if (!values.username) {
      tempErrors.username = "Name field is required.";
      errorExist = true;
    }
    if (!values.password) {
      tempErrors.password = "Password field is required.";
      errorExist = true;
    }
    if (errorExist) {
      setErrors({ ...tempErrors });
      setLoading(false);
      return;
    }
    //console.log("values : ", values);
    // postLogin({
    //   variables: { username: values.username, password: values.password },
    // });
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          className="loginBg"
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            // bgcolor: "rgb(199, 221, 233)",

            color: "#000",
          }}
        >
          <Box>
            <FormControl
              sx={{
                width: "130px",
              }}
            >
              <img src={icons.logo} alt="mula" />
            </FormControl>
            <Typography
              variant="h4"
              fontWeight="bold"
              component="p"
              className="typo logo_font"
            >
              MULA Admin Panel
            </Typography>
            <Typography variant="subtitle1" component="p" sx={{ mb: 2 }}>
              Enter your credentials to continue
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <FormControl
              style={{ borderRadius: "3px" }}
              sx={{ m: 2, width: "300px" }}
            >
              <TextField
                id="name"
                label="Name"
                size="large"
                //color="warning"
                variant="outlined"
                value={values.username}
                onChange={handleChange("username")}
                error={errors.username ? true : false}
                helperText={errors.username}
              />
            </FormControl>
            <FormControl
              style={{ borderRadius: "3px" }}
              sx={{ m: 2, width: "300px", backgroundColor: "#fff" }}
            >
              <TextField
                id="password"
                size="large"
                //color="warning"
                variant="outlined"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Password"
                error={errors.password ? true : false}
                helperText={errors.password}
              />
            </FormControl>
            <FormControl sx={{ width: "130px", margin: "auto", mt: 2 }}>
              <LoadingButton
                onClick={handleClick}
                loading={loading}
                size="large"
                variant="outlined"
                // sx={{ backgroundColor: "#000", height: 55 }}
                className="login_btn"
              >
                Login
              </LoadingButton>
            </FormControl>
          </Box>
        </Box>
        {showAlert.message && !showAlert.isError && (
          <Alert
            sx={{ position: "absolute", bottom: "1em", right: "1em" }}
            severity="success"
          >
            {showAlert.message}
          </Alert>
        )}
        {showAlert.message && showAlert.isError && (
          <Alert
            sx={{ position: "absolute", bottom: "1em", right: "1em" }}
            severity="warning"
          >
            {showAlert.message}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default Login;
