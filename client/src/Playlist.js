import React from "react";
import classnames from "classnames";
import { Icon } from "ray";

const getArtists = artists => {
  return artists.map(
    (artist, i, arr) => `${artist.name} ${i + 2 > arr.length ? "" : ", "}`
  );
};

const Playlist = props => {
  return (
    props.tracksForSpotifyPlaylist.length > 0 && (
      <div className="col col-md-4 col-lg-4">
        <h5>Playlist name goes here</h5>
        {props.tracksForSpotifyPlaylist.map((e, i) => {
          return (
            <div
              key={i}
              className={classnames(
                "d-flex align-items-center justify-content-between border-bottom",
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
    )
  );
};

export default Playlist;
