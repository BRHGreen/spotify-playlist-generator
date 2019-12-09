import React, { useState } from "react";
import classnames from "classnames";
import { Icon } from "ray";
import { Waypoint } from "react-waypoint";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

const getArtists = artists => {
  return artists.map(
    (artist, i, arr) => `${artist.name} ${i + 2 > arr.length ? "" : ", "}`
  );
};

const Playlist = props => {
  addTracksToSpotifyPlaylist = () => {
    const trackUris = this.state.tracksForSpotifyPlaylist.map(
      track => track.uri
    );
    axios
      .post("http://localhost:8888/create-playlist", {
        // need to pass this down as props
        playlistName: this.state.playlistName,
        playlistId: this.state.playlistId,
        accessToken: this.state.accessToken,
        trackUris
      })
      .then(data => {
        this.setState({ playlistCreateStaus: "success" });
      })
      .catch(err => {
        this.setState({ playlistCreateStaus: "fail" });
      });
  };

  const [containerStyle, setContainerStyle] = useState();
  console.log("TCL: containerStyle", containerStyle);
  return (
    props.tracksForSpotifyPlaylist.length > 0 && (
      <div className="col col-md-4 col-lg-4">
        <Waypoint
          onLeave={() =>
            setContainerStyle({ top: 0, position: "fixed", width: "31%" })
          }
          onEnter={() => setContainerStyle({})}
        />
        <div style={containerStyle}>
          <CreatableSelect
            isClearable
            onChange={props.handlePlaylistNameChange}
            onInputChange={props.handleInputChange}
            options={[
              { value: "hi", label: "hello" },
              { value: "bye", label: "cheerio" }
            ]}
          />

          <button
            disabled={
              props.tracksForSpotifyPlaylist.length <= 0 || !props.loggedIn
            }
            className="btn btn-secondary my-2"
            onClick={() => props.addTracksToSpotifyPlaylist()}
          >
            Create Spotify playlist
          </button>

          {props.tracksForSpotifyPlaylist.map((e, i) => {
            return (
              <div
                key={i}
                className={classnames(
                  "d-flex align-items-center justify-content-between border-bottom mx-1",
                  { "bg-light": i % 2 === 0 }
                )}
              >
                <span className="mr-1">
                  {`${getArtists(e.artists)} - ${e.name}`}
                </span>
                <div className="cursor-pointer">
                  <Icon
                    name="close"
                    onClick={() => props.handleRemoveTrack(e.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Playlist;
