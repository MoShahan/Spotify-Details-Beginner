import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const pages = ["Songs", "Artists", "Add New Song", "About Me", "Log Out"];

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
      case "About Me":
        navigate("/about");
        break;
      case "Log Out":
        navigate("/");
        break;
      default:
        console.log("Wrong Page");
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "rgba(50, 50, 50)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MusicNote />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mx: "1rem",
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SPOTIFY
          </Typography>
          <MusicNote />
          <Box sx={{ ml: "5rem", flexGrow: 1, display: "flex" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleClick(page)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  margin: "0 20px",
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": { bgcolor: "white", color: "black" },
                }}
              >
                {page}{" "}
              </Button>
            ))}{" "}
          </Box>{" "}
        </Toolbar>{" "}
      </Container>{" "}
    </AppBar>
  );
};

export default Navbar;
