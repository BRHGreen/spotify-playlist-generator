import React, { Component } from "react";
import axios from "axios";

class TrackNames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackNames: null
    };
  }

  getTrackNames = () => {
    const junoUrl =
      "https://www.junodownload.com/charts/mixcloud/worldwidefm/whats-next-with-laurent-garnier-12-02-19/526134755?timein=579&utm_source=Mixcloud&utm_medium=html5&utm_campaign=mixcloud&ref=mixcloud&a_cid=44db7396";
    axios
      .post("http://localhost:8888/track-names", { junoUrl })
      .then(response => {
        console.log("TCL: TrackNames -> getTrackNames -> response", response);
        if (response.status === 200) {
          this.setState({ trackNames: response.data });
          this.forceUpdate();
        }
      })
      .catch(function(error) {
        console.log("error", error);
      });
  };
  render() {
    console.log("TCL: TrackNames -> render -> this.state", this.state);
    return (
      <div>
        {this.state.trackNames && (
          <ul>
            {this.state.trackNames.length > 0 ? (
              this.state.trackNames.map((item, i) => {
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
        <button className="btn btn-primary" onClick={this.getTrackNames}>
          Get tracks
        </button>
      </div>
    );
  }
}

export default TrackNames;
