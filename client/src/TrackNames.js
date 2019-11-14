import React from "react";

const TrackNames = props => {
  return (
    <div>
      {props.tracks && (
        <ul>
          {props.tracks.length > 0 ? (
            props.tracks.map((item, i) => {
              console.log("TCL: item", item);
              return (
                <li key={i} className="border-bottom">
                  <div className="d-flex">
                    <b className="mr-1">Artitst: </b>
                    <p id="track-artist">{item.junoResult.artist}</p>
                  </div>
                  <div className="d-flex">
                    <b className="mr-1">Title: </b>
                    <p id="track-title">{item.junoResult.title}</p>
                  </div>
                  {item.spotifyResult &&
                    item.spotifyResult.spotifyTracks.items.map(
                      (spotifyTrack, i) => {
                        return (
                          <div
                            key={i}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <span className="mr-1">{spotifyTrack.name}</span>
                            <audio style={{ maxHeight: "25px" }} controls>
                              <source
                                src={spotifyTrack.preview_url}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio element.
                            </audio>
                            <button
                              className="btn btn-primary btn-sml"
                              onClick={() => props.handleAddTrack(spotifyTrack)}
                            >
                              +
                            </button>
                            <hr />
                          </div>
                        );
                      }
                    )}
                </li>
              );
            })
          ) : (
            <li>Couldn't find any track names</li>
          )}
        </ul>
      )}
      <button className="btn btn-primary" onClick={props.getTracks}>
        Get tracks
      </button>
    </div>
  );
};

export default TrackNames;
