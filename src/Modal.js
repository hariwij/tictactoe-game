import React from "react";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hardLevel: 1,
      playWithPc: false,
    };
  }
  className(c,a) {
    return c.toString()+" " +a.toString();
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
                Tic Tac Toe - Mini Game
              </h5>
            </div>
            <div className="modal-body">
              <h5>Play Vs</h5>
              <div className="btn-group" role="group" style={{ width: "100%" }}>
                <button
                  type="button"
                  className={this.className(
                    "btn btn-outline-secondary " , this.state.playWithPc ? "" : "active"
                  )}
                  onClick={() => this.setState({ playWithPc: false })}
                >
                  Friend
                </button>
                <button
                  type="button"
                  className={this.className(
                    "btn btn-outline-info " , this.state.playWithPc
                      ? "active"
                      : ""
                  )}
                  onClick={() => this.setState({ playWithPc: true })}
                >
                  Computer
                </button>
              </div>
              {this.state.playWithPc ? (
                <div>
                  <hr />
                  <h5>Hard Level</h5>
                  <div
                    className="btn-group"
                    role="group"
                    style={{ width: "100%" }}
                  >
                    <button
                      type="button"
                      className={this.className(
                        "btn btn-outline-success " , this.state.hardLevel === 0
                          ? "active"
                          : ""
                      )}
                      onClick={() => this.setState({ hardLevel: 0 })}
                    >
                      Easy
                    </button>
                    <button
                      type="button"
                      className={this.className(
                        "btn btn-outline-warning " , this.state.hardLevel === 1
                          ? "active"
                          : ""
                      )}
                      onClick={() => this.setState({ hardLevel: 1 })}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      className={this.className(
                        "btn btn-outline-danger " , this.state.hardLevel == 2
                          ? "active"
                          : ""
                      )}
                      onClick={() => this.setState({ hardLevel: 2 })}
                    >
                      Hard
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={()=>this.props.onClick(this.state.playWithPc,this.state.hardLevel)}
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
