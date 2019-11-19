import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import TrackNames from "./TrackNames";

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
      tracks: null,
      accessToken: token,
      tracksForPlaylist: [],
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

  searchSpotify() {
    axios
      .post("http://localhost:8888/search-for-tracks", {
        tracks: this.state.tracks,
        accessToken: this.state.accessToken
      })
      .then(res => {
        console.log("TCL: searchSpotify -> res", res.data);
        if (res.data && res.data.length > 0) {
          const newState = res.data.map(track => {
            const result = this.state.tracks.find(e => e.id === track.id);
            result.spotifyResult = track;
            return result;
          });
          console.log("TCL: searchSpotify -> newState", newState);
          this.setState({ tracks: newState });
          this.forceUpdate();
          console.log(this.state);
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  getTracks = () => {
    const junoUrl =
      "https://www.junodownload.com/charts/mixcloud/worldwidefm/whats-next-with-laurent-garnier-12-02-19/526134755?timein=579&utm_source=Mixcloud&utm_medium=html5&utm_campaign=mixcloud&ref=mixcloud&a_cid=44db7396";
    axios
      .post("http://localhost:8888/track-names", { junoUrl })
      .then(response => {
        console.log("TCL: TrackNames -> getTracks -> response", response);
        const tracks = response.data.map((track, i) => ({
          id: i,
          junoResult: track
        }));
        if (response.status === 200) {
          this.setState({ tracks });
          this.forceUpdate();
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  };

  handleAddTrack = track => {
    this.setState(state => ({
      tracksForPlaylist: [track, ...state.tracksForPlaylist]
    }));
  };

  handleRemoveTrack = trackId => {
    this.setState(state => ({
      tracksForPlaylist: state.tracksForPlaylist.filter(
        track => track.id !== trackId
      )
    }));
  };

  addTracksToSpotifyPlaylist = () => {
    // pass in playlist id if adding to existing playlist
    // pass in playlist name if adding to new playlist
    const trackUris = this.state.tracksForPlaylist.map(track => track.uri);
    axios
      .post("http://localhost:8888/create-playlist", {
        playlistName: this.state.playlistName,
        playlistId: this.state.playlistId,
        accessToken: this.state.accessToken,
        trackUris
      })
      .then(data => {
        console.log("TCL: createPlaylist -> data", data);
        this.setState({ playlistCreateStaus: "success" });
      })
      .catch(err => {
        console.log("TCL: createPlaylist -> err", err);
        this.setState({ playlistCreateStaus: "fail" });
      });
  };

  render() {
    console.log("TCL: render -> this.state", this.state);
    return (
      <div className="App">
        {!this.state.loggedIn && (
          <a href="http://localhost:8888"> Login to Spotify </a>
        )}
        {this.state.tracksForPlaylist.length > 0 &&
          this.state.tracksForPlaylist.map((e, i) => {
            return (
              <div key={i}>
                <span className="mr-1">
                  <b className="mr-1">Track name:</b>
                  {e.name}
                </span>
                <span>
                  <b className="mr-1">Track id</b>
                  {e.id}
                </span>
                <button
                  className="btn btn-danger btn-sml"
                  onClick={() => this.handleRemoveTrack(e.id)}
                >
                  x
                </button>
              </div>
            );
          })}
        <TrackNames
          getTracks={this.getTracks}
          tracks={this.state.tracks}
          handleAddTrack={this.handleAddTrack}
        />
        {this.state.loggedIn && (
          <React.Fragment>
            <button
              className="btn btn-secondary"
              onClick={() => this.searchSpotify()}
            >
              Search spotify
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => this.addTracksToSpotifyPlaylist()}
            >
              Create playlist
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
