import React from "react";

const Input = props => (
  <div className="input-group m-2">
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
);

export default Input;
