import React, { Component } from "react";
import axios from "axios";
import TrackNames from "./TrackNames";
import Playlist from "./Playlist";
import SearchButtons from "./SearchButtons";
import Input from "./Input";
import { tracksForSpotifyPlaylistMock, tracksFromJunoMock } from "./mocks";

import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      junoUrl: "",
      tracksFromJuno: null,
      accessToken: token,
      tracksForSpotifyPlaylist: [],
      playlistId: null,
      suggestedPlaylistName: ""
    };
  }
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  searchSpotify = () => {
    axios
      .post("http://localhost:8888/search-for-tracks", {
        tracksFromJuno: this.state.tracksFromJuno,
        accessToken: this.state.accessToken
      })
      .then(res => {
        if (res.data && res.data.length > 0) {
          const newState = res.data.map(track => {
            const result = this.state.tracksFromJuno.find(
              e => e.id === track.id
            );
            result.spotifyResult = track;
            return result;
          });
          this.setState({ tracksFromJuno: newState });
          this.forceUpdate();
        }
      })
      .catch(function(error) {
        console.error("error", error);
      });
  };

  getTracks = () => {
    const { junoUrl, suggestedPlaylistName } = this.state;
    axios
      .post("http://localhost:8888/track-names", { junoUrl })
      .then(response => {
        this.setState({
          suggestedPlaylistName: response.data.suggestedPlaylistName
        });
        this.forceUpdate();
        const tracksFromJuno = response.data.tracks.map((track, i) => ({
          id: i,
          junoResult: track
        }));
        if (response.status === 200) {
          this.setState({
            tracksFromJuno,
            suggestedPlaylistName
          });
          this.forceUpdate();
        }
      })
      .catch(function(error) {
        console.error("error", error);
      });
  };

  handleAddTrack = track => {
    /*
    TODO remove tracks from juno list when added to spotify list
    */
    this.setState(state => ({
      tracksForSpotifyPlaylist: [track, ...state.tracksForSpotifyPlaylist]
    }));
  };

  handleRemoveTrack = trackId => {
    this.setState(state => ({
      tracksForSpotifyPlaylist: state.tracksForSpotifyPlaylist.filter(
        track => track.id !== trackId
      )
    }));
  };

  handleJunoUrlChange = e => {
    this.setState({ junoUrl: e.target.value });
  };

  render() {
    const {
      loggedIn,
      tracksForSpotifyPlaylist,
      tracksFromJuno,
      junoUrl,
      suggestedPlaylistName
    } = this.state;

    return (
      <div className="App py-2">
        {!loggedIn && (
          <a className="m-2" href="http://localhost:8888">
            {" "}
            Login to Spotify{" "}
          </a>
        )}
        <Input
          label="Juno download URL"
          junoUrl={junoUrl}
          handleOnChange={e => this.handleJunoUrlChange(e)}
        />
        <SearchButtons
          {...this.state}
          getTracks={this.getTracks}
          searchSpotify={this.searchSpotify}
        />

        <div className="m-2">
          <div
            // className={rowClass}
            className="row"
          >
            <TrackNames
              handleAddTrack={this.handleAddTrack}
              // tracksForSpotifyPlaylist={tracksForSpotifyPlaylistMock}
              tracksForSpotifyPlaylist={tracksForSpotifyPlaylist}
              // tracksFromJuno={tracksFromJunoMock}
              tracksFromJuno={tracksFromJuno}
            />

            <Playlist
              handleRemoveTrack={this.handleRemoveTrack}
              // tracksForSpotifyPlaylist={tracksForSpotifyPlaylistMock}
              tracksForSpotifyPlaylist={tracksForSpotifyPlaylist}
              {...this.state}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
