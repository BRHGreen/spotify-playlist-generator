import React from "react";
import classnames from "classnames";
import { Icon } from "ray";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

const getArtists = artists => {
  return artists.map(
    (artist, i, arr) => `${artist.name} ${i + 2 > arr.length ? "" : ", "}`
  );
};

class Playlist extends React.Component {
  state = {
    containerStyle: {},
    playlistName: "",
    playlistCreateStaus: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.suggestedPlaylistName !== prevProps.suggestedPlaylistName) {
      this.setState({ playlistName: this.props.suggestedPlaylistName });
    }
    return null;
  }

  addTracksToSpotifyPlaylist = () => {
    const trackUris = this.props.tracksForSpotifyPlaylist.map(
      track => track.uri
    );
    axios
      .post("http://localhost:8888/create-playlist", {
        playlistName: `PLG-${this.state.playlistName}`,
        playlistId: this.props.playlistId,
        accessToken: this.props.accessToken,
        trackUris
      })
      .then(data => {
        this.setState({ playlistCreateStaus: "success" });
      })
      .catch(err => {
        this.setState({ playlistCreateStaus: "fail" });
      });
  };

  render() {
    console.log("TCL: Playlist -> render -> this.state", this.state);
    return (
      this.props.tracksForSpotifyPlaylist.length > 0 && (
        <div className="col col-md-4 col-lg-4">
          <div
            style={{
              top: "108px",
              right: "10px",
              position: "fixed",
              width: "31%"
            }}
          >
            <CreatableSelect
              isClearable
              defaultValue={{
                label: this.state.playlistName,
                value: 0
              }}
              onChange={e => this.setState({ playlistName: e.value })}
              options={[
                { value: "hi", label: "hello" },
                { value: "bye", label: "cheerio" }
              ]}
            />

            <button
              disabled={
                this.props.tracksForSpotifyPlaylist.length <= 0 ||
                !this.props.loggedIn
              }
              className="btn btn-secondary my-2"
              onClick={() => this.addTracksToSpotifyPlaylist()}
            >
              Create Spotify playlist
            </button>

            {this.props.tracksForSpotifyPlaylist.map((e, i) => {
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
                      onClick={() => this.props.handleRemoveTrack(e.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    );
  }
}

export default Playlist;
