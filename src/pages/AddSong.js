import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  bgcolor: "rgba(0,0,0,0.9)",
  border: "2px solid #FFF",
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddSong = () => {
  const [date, setDate] = useState("");
  const [songName, setSongName] = useState("");
  const [artwork, setArtwork] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [newArtistName, setNewArtistName] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");

  const [artistList, setArtistsList] = useState([]);

  const [selectedArtists, setSelectedArtists] = useState([]);

  const handleArtistChange = (event) => {
    setSelectedArtists(event.target.value);
  };

  const handleAddSong = () => {
    axios
      .post("http://localhost:3001/add/song", {
        songsName: songName,
        artists: selectedArtists.join(", "),
        date: date,
        image: artwork,
      })
      .then(() => {
        console.log("Add Song Resolved");
      })
      .catch((e) => {
        console.log(e);
      });
    alert("Song has been Added");
    navigate("/songs");
  };

  const handleAddArtist = () => {
    axios
      .post("http://localhost:3001/add/artist", {
        artistsName: newArtistName,
        dob: dob,
        bio: bio,
      })
      .then(() => {
        alert("New Artist Added");
      });
    setOpenModal(false);
    setNewArtistName("");
    setDob("");
    setBio("");
  };

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/get/artists")
      .then((response) => {
        setArtistsList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [openModal]);

  return (
    <div>
      <h2> Adding a New Song </h2>
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
          bgcolor: "rgba(0,0,0,0.5)",
        }}
      >
        <TextField
          variant="filled"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          label="Song Name"
          required
          autoFocus
          InputLabelProps={{ style: { color: "#1976d2" } }}
          InputProps={{ style: { color: "white" } }}
          sx={{ bgcolor: "rgba(100,100,100,0.5)" }}
        />
        <TextField
          InputLabelProps={{ shrink: true, style: { color: "#1976d2" } }}
          InputProps={{ style: { color: "white" } }}
          sx={{ bgcolor: "rgba(100,100,100,0.5)" }}
          variant="filled"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          label="Date Released"
          type="date"
          required
        />
        <TextField
          InputLabelProps={{
            style: { color: "#1976d2" },
          }}
          title="Add your image to artwork folder and give filename with extension here"
          InputProps={{ style: { color: "white" } }}
          sx={{ bgcolor: "rgba(100,100,100,0.5)" }}
          variant="filled"
          value={artwork}
          onChange={(e) => setArtwork(e.target.value)}
          label="Artwork"
          required
          placeholder="Enter you filename with extension"
        />
        <FormControl>
          <InputLabel sx={{ color: "#1976d2" }}> Artists </InputLabel>{" "}
          <Select
            multiple
            value={selectedArtists}
            onChange={handleArtistChange}
            input={<OutlinedInput label="Artists" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
            sx={{
              bgcolor: "rgba(100,100,100,0.5)",
              color: "white",
            }}
          >
            {artistList.map((artist) => (
              <MenuItem key={artist.artistsName} value={artist.artistsName}>
                <Checkbox
                  checked={selectedArtists.indexOf(artist.artistsName) > -1}
                />
                <ListItemText primary={artist.artistsName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          sx={{
            width: "30%",
            margin: "auto",
            my: "0",
          }}
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Add New Artist{" "}
        </Button>{" "}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={style}>
            <h3 style={{ color: "white" }}> Adding New Artist </h3>{" "}
            <TextField
              variant="filled"
              value={newArtistName}
              onChange={(e) => setNewArtistName(e.target.value)}
              label="Artist Name"
              required
              fullWidth
              InputLabelProps={{ style: { color: "#1976d2" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{ bgcolor: "rgba(100,100,100,0.5)" }}
            />
            <TextField
              fullWidth
              variant="filled"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              label="Date of Birth"
              type="date"
              required
              InputLabelProps={{
                style: { color: "#1976d2" },
                shrink: true,
              }}
              InputProps={{ style: { color: "white" } }}
              sx={{ bgcolor: "rgba(100,100,100,0.5)" }}
            />
            <TextField
              rows={4}
              fullWidth
              variant="filled"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              label="Bio"
              multiline
              required
              InputLabelProps={{ style: { color: "#1976d2" } }}
              InputProps={{ style: { color: "white" } }}
              sx={{ bgcolor: "rgba(100,100,100,0.5)" }}
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
        <Button
          variant="contained"
          type="submit"
          onClick={handleAddSong}
          sx={{
            width: "50%",
            margin: "0 auto",
          }}
        >
          Save Song To Database
        </Button>
      </Paper>
    </div>
  );
};

export default AddSong;
