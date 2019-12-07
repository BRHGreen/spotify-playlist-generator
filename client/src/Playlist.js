import React from "react";

const Playlist = props => {
  return (
    props.tracksForSpotifyPlaylist.length > 0 && (
      <div className="col col-md-3 col-lg-3">
        {props.tracksForSpotifyPlaylist.map((e, i) => {
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
                onClick={() => props.handleRemoveTrack(e.id)}
              >
                x
              </button>
            </div>
          );
        })}
      </div>
    )
  );
};

export default Playlist;
