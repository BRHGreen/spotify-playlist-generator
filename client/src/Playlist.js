import React, { useState } from "react";
import classnames from "classnames";
import { Icon } from "ray";
import { Waypoint } from "react-waypoint";
import CreatableSelect from "react-select/creatable";

const getArtists = artists => {
  return artists.map(
    (artist, i, arr) => `${artist.name} ${i + 2 > arr.length ? "" : ", "}`
  );
};

const Playlist = props => {
  const [containerStyle, setContainerStyle] = useState();
  console.log("TCL: containerStyle", containerStyle);
  return (
    props.tracksForSpotifyPlaylist.length > 0 && (
      <div className="col col-md-4 col-lg-4">
        <Waypoint
          onLeave={() =>
            setContainerStyle({ top: 0, position: "fixed", width: "31%" })
          }
          onEnter={() => setContainerStyle({})}
        />
        <div style={containerStyle}>
          <CreatableSelect
            isClearable
            onChange={props.handlePlaylistNameChange}
            onInputChange={props.handleInputChange}
            options={[
              { value: "hi", name: "hello" },
              { value: "bye", name: "cheerio" }
            ]}
          />

          {props.tracksForSpotifyPlaylist.map((e, i) => {
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
                    onClick={() => props.handleRemoveTrack(e.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Playlist;
