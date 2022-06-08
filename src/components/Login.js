import { Button, Paper, TextField } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";

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
      <h1>Welcome to My Spotify App</h1>
      <form action="" onSubmit={handleLogin}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            marginTop: "50px",
            width: "300px",
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
            label="Username"
            required
            autoFocus
            InputLabelProps={{ style: { color: "#1976d2" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <TextField
            InputLabelProps={{ style: { color: "#1976d2" } }}
            value={password}
            helperText={invalid ? "Enter correct password" : ""}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={invalid ? true : false}
            label="Password"
            InputProps={{ style: { color: "white" } }}
            type="password"
            variant="filled"
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Paper>
      </form>
    </>
  );
};

export default Login;
