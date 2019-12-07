import React from "react";
import { Icon } from "ray";

const TrackNames = props => {
  return (
    <div>
      {props.tracks && (
        <ul className="list-group">
          {props.tracks.length > 0 ? (
            props.tracks.map((item, i) => {
              return (
                <li key={i} className="border-bottom list-group-item p-0">
                  <div className="d-flex m-0 bg-light ">
                    <div className="d-flex align-items-center">
                      <b className="mr-1">Artitst: </b>
                      <span id="track-artist">{item.junoResult.artist}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <b className="mr-1">Title: </b>
                      <span id="track-title">{item.junoResult.title}</span>
                    </div>
                  </div>
                  {item.spotifyResult &&
                    item.spotifyResult.spotifyTracks.items.map(
                      (spotifyTrack, i) => {
                        return (
                          <div key={spotifyTrack.id}>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="mr-1">{spotifyTrack.name}</span>
                              <div className="m-0 d-flex align-items-center">
                                <audio style={{ maxHeight: "25px" }} controls>
                                  <source
                                    src={spotifyTrack.preview_url}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                                <div
                                  className="m-0"
                                  style={{ cursor: "pointer" }}
                                >
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
    </div>
  );
};

export default TrackNames;
