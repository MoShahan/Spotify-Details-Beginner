import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import {} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const pages = ["Songs", "Artists", "Add New Song", "About Us"];

const Navbar = () => {
  const navigate = useNavigate();

  const handleClick = (page) => {
    switch (page) {
      case "Artists":
        navigate("/artists");
        break;
      case "Songs":
        navigate("/songs");
        break;
      case "Add New Song":
        navigate("/add");
        break;
      default:
        console.log("Wrong Page");
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "gray" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map((page) => (
              <Button
                color="secondary"
                key={page}
                onClick={() => handleClick(page)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  margin: "0 20px",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
