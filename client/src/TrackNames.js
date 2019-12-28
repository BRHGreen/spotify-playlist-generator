import React from "react";
import { Icon } from "ray";
import classnames from "classnames";

const TrackNames = props => {
  const columnClass = classnames({
    "col col-md-8 col-lg-8": props.tracksForSpotifyPlaylist.length > 0
  });

  const filterTrackNames = trackNameArray => {
    return trackNameArray.reduce((filteredTracks, currentTrack) => {
      const isFirstIteration = filteredTracks.length === 0;
      const hasSameTrackName = filteredTracks.find(
        e => e.name.toLowerCase() === currentTrack.name.toLowerCase()
      );
      const hasSameArtistName =
        !isFirstIteration &&
        filteredTracks.find(
          e =>
            e.artists[0].name.toLowerCase() ===
            currentTrack.artists[0].name.toLowerCase()
        );

      if (isFirstIteration || !hasSameTrackName || !hasSameArtistName) {
        filteredTracks.push(currentTrack);
        return filteredTracks;
      }
      return filteredTracks;
    }, []);
  };

  return (
    <div className={columnClass}>
      {props.tracksFromJuno && (
        <ul className="list-group">
          {props.tracksFromJuno.length > 0 ? (
            props.tracksFromJuno.map((item, i) => {
              return (
                <li key={i} className="border-bottom list-group-item p-0">
                  <div className="d-flex bg-light p-2">
                    <div className="d-flex align-items-center mr-2">
                      <b className="mr-1">Artitst: </b>
                      <span id="track-artist">{item.junoResult.artist}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <b className="mr-1">Title: </b>
                      <span id="track-title">{item.junoResult.title}</span>
                    </div>
                  </div>
                  {item.spotifyResult &&
                    filterTrackNames(
                      item.spotifyResult.spotifyTracks.items
                    ).map(spotifyTrack => {
                      return (
                        <div
                          key={spotifyTrack.id}
                          className="p-2 border-bottom"
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="mr-1">{spotifyTrack.name}</span>
                            <div className="d-flex align-items-center">
                              <audio style={{ maxHeight: "25px" }} controls>
                                <source
                                  src={spotifyTrack.preview_url}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </audio>
                              <div className="cursor-pointer">
                                <Icon
                                  name="add"
                                  onClick={() =>
                                    props.handleAddTrack(spotifyTrack)
                                  }
                                  className="ml-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </li>
              );
            })
          ) : (
            <li>Couldn't find any track names</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TrackNames;
