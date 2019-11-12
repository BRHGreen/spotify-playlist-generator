import React from "react";

const TrackNames = props => {
  console.log("TCL: TrackNames -> render -> this.state", props);
  return (
    <div>
      {props.tracks && (
        <ul>
          {props.tracks.length > 0 ? (
            props.tracks.map((item, i) => {
              return (
                <li key={i} className="border-bottom">
                  <div className="d-flex">
                    <b className="mr-1">Artitst: </b>
                    <p id="track-artist">{item.artist}</p>
                  </div>
                  <div className="d-flex">
                    <b className="mr-1">Title: </b>
                    <p id="track-title">{item.title}</p>
                  </div>
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
