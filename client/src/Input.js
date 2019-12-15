import React from "react";
import classnames from "classnames";

const Input = props => {
  const columnClass = classnames({
    "col col-md-8 col-lg-8": props.tracksForSpotifyPlaylist.length > 0
  });
  return (
    <div className={columnClass}>
      <div className="row">
        <div className="input-group m-2 px-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">
              {props.label}
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={e => props.handleOnChange(e)}
            value={props.junoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
