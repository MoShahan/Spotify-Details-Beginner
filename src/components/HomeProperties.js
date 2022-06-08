import React from "react";

const HomeProperties = () => {
  return (
    <div className="properties">
      <ul>
        <h2>Properties of This App</h2>
        <li>
          <p>
            Clicking on the <span>SONGS</span> button will take you to a list of
            songs.
          </p>
          <p>
            There you can Toggle between top 10 songs or list of all songs in
            database in descending order of their ratings.
          </p>
        </li>
        <li>
          <p>
            Clicking on the <span>ARTISTS</span> button will take you to a list
            of artists.
          </p>
          <p>
            There you can Toggle between top 10 artists or list of all artists
            in database in descending order of the average ratings of their
            songs.
          </p>
        </li>
        <li>
          <p>
            Clicking on the <span>ADD NEW SONG</span> button will take you to a
            page where you can add new song by giving your details.
          </p>
          <p>You can even add new Artist also.</p>
        </li>
        <li>
          Clicking on the <span>ABOUT US</span> button will take you to a
          details page about the developer of this app.
        </li>
        <li>
          Clicking on the <span>LOG OUT</span> button will log you out from this
          app.
        </li>
      </ul>
    </div>
  );
};

export default HomeProperties;
