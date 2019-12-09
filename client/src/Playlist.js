import React from "react";
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

class Playlist extends React.Component {
  state = {
    containerStyle: {},
    playlistName: "",
    playlistCreateStaus: "",
    susuggestedPlaylistName: ""
  };

  componentDidUpdate(prevProps) {
    const { suggestedPlaylistName } = this.props;
    if (
      suggestedPlaylistName &&
      suggestedPlaylistName !== prevProps.suggestedPlaylistName
    ) {
      this.setState({ suggestedPlaylistName });
      return;
    }
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
    console.log(
      "TCL: Playlist -> componentDidUpdate -> this.props",
      this.state
    );
    return (
      this.props.tracksForSpotifyPlaylist.length > 0 && (
        <div className="col col-md-4 col-lg-4">
          <Waypoint
            onLeave={this.setState({
              containerStyle: {
                top: "10px",
                right: "10px",
                position: "fixed",
                width: "31%"
              }
            })}
            onEnter={() => this.setState({ containerStyle: {} })}
          />
          <div style={this.state.containerStyle}>
            <CreatableSelect
              isClearable
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
