import React from "react";

export default class GameEnd extends React.Component {
  className(c) {
    return c.toString();
  }
  render() {
    return (
      <div
        className=""
        style={{
          top: "0px",
          left: "0px",
          position: "absolute",
          width: "100vw",
          height: "100vh",
          background: "radial-gradient(50% 50% at 50% 50%, rgba(12, 10, 33, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)"
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content text-white"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #0f0f0f 0%, #03233D 100%)",
            }}
          >
            <div className="modal-header text-center">
              <h5 className="modal-title" style={{ width: "100%" }}>
                Game Over!
              </h5>
            </div>
            <div className="modal-body">
              <center>
                <h1>{this.props.txt}</h1>
                <br></br>
                <button
                  className="btn btn-success"
                  onClick={() => this.props.onClick()}
                >
                  Play Again
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
