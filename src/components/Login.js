import { Button, Paper, TextField } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";

export const LoginContext = createContext([]);

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName === "admin" && password === "admin") {
      navigate("/home");
    } else {
      setInvalid(true);
    }
  };

  return (
    <>
      <form action="" onSubmit={handleLogin}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            marginTop: "100px",
            width: "50%",
            height: "300px",
            justifyContent: "space-evenly",
            padding: "0 50px",
            bgcolor: "#121212",
          }}
        >
          <TextField
            error={invalid ? true : false}
            variant="filled"
            helperText={invalid ? "Enter correct username" : ""}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            id="outlined-error"
            label="Username"
            required
            InputLabelProps={{ style: { color: "#1976d2" } }}
          />
          <TextField
            InputLabelProps={{ style: { color: "#1976d2" } }}
            value={password}
            helperText={invalid ? "Enter correct password" : ""}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={invalid ? true : false}
            id="filled-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
          {/* {invalid ? <div>Enter correct values</div> : <div>.</div>} */}
          {/* try helper text instead */}
        </Paper>
      </form>
    </>
  );
};

export default Login;
