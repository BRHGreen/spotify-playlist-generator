import React, { Component } from "react";
import classnames from "classnames";
import "./App.css";
import axios from "axios";
import TrackNames from "./TrackNames";
import Playlist from "./Playlist";
import SearchButtons from "./SearchButtons";

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
      junoUrl:
        "https://www.junodownload.com/charts/mixcloud/cedric-lassonde/cw-batb-sept-19/536662218?timein=0&utm_source=Mixcloud&utm_medium=html5&utm_campaign=mixcloud&ref=mixcloud&a_cid=44db7396",
      tracksFromJuno: null,
      accessToken: token,
      tracksForSpotifyPlaylist: [],
      playlistName: "bens-test-playlist 5",
      playlistId: null
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
    const { junoUrl } = this.state;
    axios
      .post("http://localhost:8888/track-names", { junoUrl })
      .then(response => {
        const tracksFromJuno = response.data.map((track, i) => ({
          id: i,
          junoResult: track
        }));
        if (response.status === 200) {
          // TO DO: set state for whole array
          this.setState({
            tracksFromJuno: [tracksFromJuno[0], tracksFromJuno[1]]
          });
          this.forceUpdate();
        }
      })
      .catch(function(error) {
        console.error("error", error);
      });
  };

  handleAddTrack = track => {
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

  addTracksToSpotifyPlaylist = () => {
    const trackUris = this.state.tracksForSpotifyPlaylist.map(
      track => track.uri
    );
    axios
      .post("http://localhost:8888/create-playlist", {
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

  render() {
    const { loggedIn, tracksForSpotifyPlaylist, tracksFromJuno } = this.state;

    const rowClass = classnames({
      row: tracksForSpotifyPlaylist.length > 0
    });

    return (
      <div className="App py-2">
        {!loggedIn && <a href="http://localhost:8888"> Login to Spotify </a>}
        <SearchButtons
          {...this.state}
          getTracks={this.getTracks}
          addTracksToSpotifyPlaylist={this.addTracksToSpotifyPlaylist}
          searchSpotify={this.searchSpotify}
        />

        <div className="m-2">
          <div className={rowClass}>
            <TrackNames
              getTracks={this.getTracks}
              tracks={tracksFromJuno}
              handleAddTrack={this.handleAddTrack}
              tracksForSpotifyPlaylist={tracksForSpotifyPlaylist}
            />

            <Playlist
              handleRemoveTrack={this.handleRemoveTrack}
              tracksForSpotifyPlaylist={tracksForSpotifyPlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
