import React from "react";
import ReactDOM from "react-dom";
import Cell from "./Cell";

export default class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hardLevel: 1,
      map: [],
      mapSize: 3,
      emptyCell: 0,
      currentPlayer: 1,
      playWithPc: true,
      p1won: false,
      p2won: false,
      isGameDraw: false,
    };
    this.reset();
  }

  cellClick(x, y) {
    let tmp = this.state.map;
    if (this.state.currentPlayer == 1 && this.state.map[x][y] == 0) {
      tmp[x][y] = 1;
      this.setState({ map: tmp, currentPlayer: 2 });
    } else if (this.state.currentPlayer == 2 && this.state.map[x][y] == 0) {
      tmp[x][y] = 2;
      this.setState({ map: tmp, currentPlayer: 1 });
    }
    this.setState({ p1won: this.CheckWin(tmp, 1) });
    this.setState({ p2won: this.CheckWin(tmp, 2) });

    this.setState({ isGameDraw: this.GameOver(tmp) });

    if (this.state.isGameDraw || this.state.won) {
    } else if (this.state.playWithPc) {
      console.log("Auto Play");
      let nmap = this.Play(this.state.map, 2, 1, this.state.hardLevel);
      this.setState({ map: nmap, currentPlayer: 1 });
    }
  }
  reset() {
    let tmap = this.state.map;
    for (let i = 0; i < this.state.mapSize; i++) {
      tmap.push(new Array(3).fill(0));
    }
    this.setState({
      map: tmap,
      currentPlayer: 1,
      p1won: false,
      p2won: false,
      isGameDraw: false,
    });
  }
  CheckWin(Map, Player) {
    let res = new Array(4).fill(0);
    for (let r = 0; r < this.state.mapSize; r++) {
      for (let c = 0; c < this.state.mapSize; c++) {
        if (Map[r][c] === Player) res[0]++; // Check Rows
        if (Map[c][r] === Player) res[1]++; // Check Cols
        if (Map[c][c] === Player) res[2]++; // Diagnal Left-Right
        if (
          Map[this.state.mapSize - 1 - c][this.state.mapSize - 1 - c] === Player
        ) {
          res[3]++; // Diagnal Left-Right
        }
      }
      if (res[0] == 3 || res[1] == 3 || res[2] == 3 || res[3] == 3) {
        console.log(Map);
        console.log(res);
        res = new Array(4).fill(0); // Reset Values
        return true;
      } // Check & Return
      res = new Array(4).fill(0); // Reset Values
    }
    return false;
  }
  GameOver(Map) {
    for (let r = 0; r < this.state.mapSize; r++) {
      for (let c = 0; c < this.state.mapSize; c++) {
        if (Map[r][c] == this.state.emptyCell) return false;
      }
    }
    return true;
  }
  Play(Map, Player, OtherPlayer, HardLevel = 1) {
    let suc = false;
    let res = this.TryToFinishGame(Map, Player, Player); // Try To Win
    Map = res[0];
    suc = res[1];
    if (suc) return Map;
    if (HardLevel >= 1) {
      res = this.TryToFinishGame(Map, OtherPlayer, Player); // Block Wining Chance
      Map = res[0];
      suc = res[1];
      if (suc) return Map;
    }
    if (HardLevel >= 2) {
      res = this.IntelligentPlay(Map, OtherPlayer, Player); // Tie Game
      Map = res[0];
      suc = res[1];
      if (suc) return Map;
    }
    // Fill Random
    let arr = [];
    for (let r = 0; r < this.state.mapSize; r++) {
      for (let c = 0; c < this.state.mapSize; c++) {
        if (Map[r][c] == this.state.emptyCell) {
          arr.push({ r, c });
        }
      }
    }
    if (arr.length > 0) {
      let r1 = this.getRandomInt(arr.length);
      console.log("r1 ", arr[r1]);
      Map[arr[r1].r][arr[r1].c] = Player;
    }
    return Map;
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  TryToFinishGame(Map, CheckingPlayer, ReplacingPlayer) {
    for (let r = 0; r < this.state.mapSize; r++) {
      for (let c = 0; c < this.state.mapSize; c++) {
        if (Map[r][c] == this.state.emptyCell) {
          Map[r][c] = CheckingPlayer;
          if (this.CheckWin(Map, CheckingPlayer)) {
            Map[r][c] = ReplacingPlayer;
            return [Map, true];
          } else Map[r][c] = this.state.emptyCell;
        }
      }
    }
    return [Map, false];
  }
  IntelligentPlay(Map, CheckingPlayer, ReplacingPlayer) {
    for (let r = 0; r < this.state.mapSize; r++) {
      for (let c = 0; c < this.state.mapSize; c++) {
        if (Map[r][c] == CheckingPlayer) {
          let idx = this.FindNearIndexes(
            r,
            c,
            this.state.mapSize,
            this.state.mapSize
          );
          for (let i = 0; i < idx.Length; i++) {
            if (Map[idx[i][0]][idx[i][1]] == this.state.emptyCell) {
              Map[r][c] = ReplacingPlayer;
              return [Map, true];
            }
          }
        }
      }
    }
    return [Map, false];
  }
  FindNearIndexes(x, y, w, h) {
    let Result = [];
    let n = 1;
    if (x - n >= 0) Result[Result.Length] = new Array(2).fill(x - n, y);
    if (x + n < w) Result[Result.Length] = new Array(2).fill(x + n, y);
    if (y - n >= 0) Result[Result.Length] = new Array(2).fill(x, y - n);
    if (y + n < h) Result[Result.Length] = new Array(2).fill(x, y + n);
    if (x - n >= 0 && y - n >= 0)
      Result[Result.Length] = new Array(2).fill(x - n, y - n);
    if (x + n < w && y + n < h)
      Result[Result.Length] = new Array(2).fill(x + n, y + n);
    if (x - n >= 0 && y + n < h)
      Result[Result.Length] = new Array(2).fill(x - n, y + n);
    if (x + n < w && y - n >= 0)
      Result[Result.Length] = new Array(2).fill(x + n, y - n);
    return Result;
  }
  render() {
    return (
      <div>
        <h1>Current Player : {this.state.currentPlayer}</h1>
        <h2>Won Player 1: {this.state.p1won.toString()}</h2>
        <h2>Won Player 2: {this.state.p2won.toString()}</h2>
        <h2>Draw : {this.state.isGameDraw.toString()}</h2>
        <div
          className="row border rounded mt-auto mb-auto"
          style={{ width: "450px", height: "450px", padding: "5px" }}
        >
          {this.state.map.map((row, x) =>
            row.map((value, y) => (
              <Cell
                key={x.toString() + y.toString()}
                x={x}
                y={y}
                value={value}
                onClick={(xpos, ypos) => this.cellClick(xpos, ypos)}
              ></Cell>
            ))
          )}
        </div>
      </div>
    );
  }
}
