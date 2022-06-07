import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import artists from "../datas/artists.json";
// import "fs";

const style = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddSong = () => {
  const [artist, setArtist] = useState("");
  const [date, setDate] = useState("");
  const [songName, setSongName] = useState("");
  const [artwork, setArtwork] = useState("");
  const [openModal, setOpenModal] = useState(false);

  console.log(artwork);

  const handleAddSong = (e) => {
    e.preventDefault();
  };

  const handleAddArtist = () => {
    // const fs = require("fs");
    // var name = "../datas/artists.json";
    // var m = JSON.parse(fs.readFileSync(name).toString());
    // m.forEach((p) => {
    //   console.log(p, m);
    //   p.name = m.name;
    // });
    // fs.writeFileSync(name, JSON.stringify(m));
  };

  return (
    <div>
      <h2>Adding a New Song</h2>
      <form action="" onSubmit={handleAddSong}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            marginTop: "100px",
            width: "50%",
            height: "70vh",
            justifyContent: "space-evenly",
            padding: "0 50px",
          }}
        >
          <TextField
            variant="filled"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            label="Song Name"
            required
          />

          <TextField
            variant="filled"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            label="Date Released"
            type="date"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            variant="filled"
            value={artwork}
            onChange={(e) => setArtwork(e.target.value)}
            label="Artwork"
            type="file"
            required
            InputLabelProps={{
              shrink: true,
            }}
            // accept= ".png, .jpeg",
          />

          <FormControl variant="filled" sx={{ minWidth: 120 }}>
            <InputLabel>Artists</InputLabel>
            <Select
              value={artist}
              onChange={(e) => {
                setArtist(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {artists.map((artist) => (
                <MenuItem key={artist.name} value={artist.name}>
                  {artist.name}
                </MenuItem>
              ))}
              {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Add Artist
          </Button>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box sx={style}>
              <TextField
                variant="filled"
                // value={songName}
                // onChange={(e) => setSongName(e.target.value)}
                label="Artist Name"
                required
                fullWidth
              />
              <TextField
                fullWidth
                variant="filled"
                // value={songName}
                // onChange={(e) => setSongName(e.target.value)}
                label="Date of Birth"
                required
              />
              <TextField
                rows={4}
                fullWidth
                variant="filled"
                // value={songName}
                // onChange={(e) => setSongName(e.target.value)}
                label="Bio"
                multiline
                required
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  variant="contained"
                  onClick={(e) => {
                    setOpenModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleAddArtist}>
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>

          <Button variant="contained" type="submit">
            Save
          </Button>
        </Paper>
      </form>
    </div>
  );
};

export default AddSong;
