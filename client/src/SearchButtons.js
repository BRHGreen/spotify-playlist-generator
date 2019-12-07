import React from "react";

const SearchButtons = props => {
  return (
    <div className="my-2">
      <button
        disabled={!props.junoUrl}
        className="btn btn-primary mr-1"
        onClick={props.getTracks}
      >
        Get tracks
      </button>
      <button
        disabled={
          !props.tracksFromJuno ||
          props.tracksFromJuno.length <= 0 ||
          !props.loggedIn
        }
        className="btn btn-secondary mr-1"
        onClick={() => props.searchSpotify()}
      >
        Search spotify
      </button>
      <button
        disabled={props.tracksForSpotifyPlaylist.length <= 0 || !props.loggedIn}
        className="btn btn-secondary"
        onClick={() => props.addTracksToSpotifyPlaylist()}
      >
        Create Spotify playlist
      </button>
    </div>
  );
};

export default SearchButtons;
