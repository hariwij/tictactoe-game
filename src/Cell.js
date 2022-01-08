import React from "react";

export default class Cell extends React.Component {
  render() {
    let txt = "";
    if (this.props.value == 0) txt = "";
    else if (this.props.value == 1) txt = "x";
    else if (this.props.value == 2) txt = "o";
    return (
      <div className="col-4" style={{ padding: "5px",maxHeight:'150px',maxWidth:'150px',overflow:"hidden" }}>
        <div
          className="border rounded"
          style={{ borderWidth: "2px  !important", height: "100%" }}
          onClick={() => this.props.onClick(this.props.x, this.props.y)}
        >
          <h1
            className="text-center"
            style={{
              width: "100%",
              height: "100%",
              verticalAlign: "middle",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {txt}
          </h1>
        </div>
      </div>
    );
  }
}
