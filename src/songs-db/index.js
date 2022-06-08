const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

// CONFIGURE OUR OWN MYSQL USERNAME AND PASSWORD
// ADD YOUR OWN USERNAME IN PLACE OF "root"
// ADD YOU OWN PASSWORD IN PLACE OF "password"
// EITHER ADD SCHEMA "spotify-db" IN YOUR MYSQL OR GIVE YOUR OWN SCHEMA NAME IN PLACE OF "spotify-db"
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "#Shahan786",
  database: "spotify-db",
});
// =================================================================================================

app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/get/songs", (req, res) => {
  const sqlSelectSongs = "SELECT * FROM songs";
  db.query(sqlSelectSongs, (err, result) => {
    // console.log(result);
    console.log("Error =", err);
    res.send(result);
  });
});

app.post("/add/artist", (req, res) => {
  // getting the values which is passed by frontend
  const artistsName = req.body.artistsName;
  const dob = req.body.dob;
  const bio = req.body.bio;

  // inserting the value into the database
  const sqlInsertArtist =
    "INSERT INTO artists (artistsName,dob,bio) VALUES (?,?,?)";
  db.query(sqlInsertArtist, [artistsName, dob, bio], (err, result) => {
    console.log("Error =", err);
  });
});

app.post("/add/song", (req, res) => {
  // getting the values which is passed by frontend
  const songsName = req.body.songsName;
  const artists = req.body.artists;
  const date = req.body.date;
  const image = req.body.image;

  // inserting the value into the database
  const sqlInsertSong =
    "INSERT INTO songs (songsName,artists,date,image) VALUES (?,?,?,?)";
  db.query(sqlInsertSong, [songsName, artists, date, image], (err, result) => {
    console.log("Error =", err);
  });
});

app.post("/add/ratings", (req, res) => {
  const rating = req.body.rating;
  const songsName = req.body.songsName;
  const sqlInsertRating =
    "UPDATE 'spotify-db'.'songs' SET 'ratings' = '?' WHERE ('songsName' = '?')";
  db.query(sqlInsertRating, [rating, songsName], (err, result) => {
    console.log("Error =", err);
  });
});

app.listen(3001, () => {
  console.log("Listening...");
});
