import React from "react";

const Input = props => {
  return (
    <div className="input-group">
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
        value={props.value}
      />
    </div>
  );
};

export default Input;
