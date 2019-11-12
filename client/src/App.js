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
      accessToken: token
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
    console.log("TCL: App -> searchSpotify -> token", this.state.accessToken);
    axios
      .post("http://localhost:8888/search-for-tracks", {
        tracks: this.state.tracks,
        accessToken: this.state.accessToken
      })
      .then(data => {
        console.log("TCL: App -> searchSpotify -> data", data);
        if (data.tracks && data.tracks.items.length > 0) {
          console.log("TCL: data", data.tracks);
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
        if (response.status === 200) {
          this.setState({ tracks: response.data });
          this.forceUpdate();
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  };

  render() {
    return (
      <div className="App">
        {!this.state.loggedIn && (
          <a href="http://localhost:8888"> Login to Spotify </a>
        )}
        <TrackNames getTracks={this.getTracks} tracks={this.state.tracks} />
        {this.state.loggedIn && (
          <button
            className="btn btn-secondary"
            onClick={() => this.searchSpotify()}
          >
            Search spotify
          </button>
        )}
      </div>
    );
  }
}

export default App;
