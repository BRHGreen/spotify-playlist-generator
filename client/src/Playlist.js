import React from "react";
import classnames from "classnames";
import { Icon } from "ray";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import Input from "./Input";

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
        this.setState({
          playlistCreateStaus: "Your playlist has been created"
        });
      })
      .catch(err => {
        this.setState({
          playlistCreateStaus: "You fucked it right up"
        });
      });
  };

  render() {
    return (
      this.props.tracksForSpotifyPlaylist.length > 0 && (
        <div className="col col-md-4 col-lg-4">
          <div
            style={{
              top: "1rem",
              right: "10px",
              position: "fixed",
              width: "31%"
            }}
          >
            <Input
              label="Playlist name"
              value={this.state.playlistName}
              handleOnChange={e =>
                this.setState({ playlistName: e.target.value })
              }
            />
            {this.state.playlistCreateStaus && (
              <div>{this.state.playlistCreateStaus}</div>
            )}
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
            <div>{}</div>
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
