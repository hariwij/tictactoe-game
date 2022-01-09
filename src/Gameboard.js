import React from "react";
import ReactDOM from "react-dom";
import Cell from "./Cell";
import GameEnd from "./GameEnd";
import Modal from "./Modal";

export default class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hardLevel: 0,
      map: [],
      mapSize: 3,
      emptyCell: 0,
      currentPlayer: 1,
      playWithPc: true,
      p1won: false,
      p2won: false,
      isGameDraw: false,
      showDialog: true,
    };
    this.reset();
  }

  cellClick(x, y) {
    if (this.state.isGameDraw || this.state.p1won || this.state.p2won) return;
    let tmp = this.state.map;
    if (this.state.currentPlayer == 1 && this.state.map[x][y] == 0) {
      tmp[x][y] = 1;
      this.setState({ map: tmp, currentPlayer: 2 });
    } else if (this.state.currentPlayer == 2 && this.state.map[x][y] == 0) {
      tmp[x][y] = 2;
      this.setState({ map: tmp, currentPlayer: 1 });
    }
    this.setState({ p1won: this.CheckWin(tmp, 1) });
    this.setState({ isGameDraw: this.GameOver(tmp) });
    if (this.state.isGameDraw || this.state.p1won) {
    } else if (this.state.playWithPc) {
      console.log("Auto Play");
      let nmap = this.Play(this.state.map, 2, 1, this.state.hardLevel);
      this.setState({ map: nmap, currentPlayer: 1 });
    }

    this.setState({ p2won: this.CheckWin(tmp, 2) });
    this.setState({ isGameDraw: this.GameOver(tmp) });
  }
  reset() {
    let tmap = [];
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
        if (Map[r][c] === Player) res[0] += 1; // Check Rows
        if (Map[c][r] === Player) res[1] += 1; // Check Cols
        if (Map[c][c] === Player) res[2] += 1; // Diagonal Left-Right
        if (Map[c][this.state.mapSize - 1 - c] === Player) res[3]++; // Diagonal Left-Right
      }
      if (res[0] == 3 || res[1] == 3 || res[2] == 3 || res[3] == 3) {
        console.log(Map);
        console.log("Player : ", Player, " Val : ", res);
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
  startGame(playWithPC, hardLevel) {
    this.reset();
    this.setState({
      hardLevel: hardLevel,
      playWithPc: playWithPC,
      showDialog: false,
    });
  }
  playAgain() {
    this.reset();
    this.setState({
      showDialog: true,
    });
  }
  render() {
    let hl = "";
    if (this.state.hardLevel == 0) hl = "Easy";
    else if (this.state.hardLevel == 1) hl = "Medium";
    else if (this.state.hardLevel == 2) hl = "Hard";
    let pl = "";
    if (this.state.currentPlayer == 1) pl = "Player X";
    else if (this.state.currentPlayer == 2) pl = "Player O (Friend)";
    if (this.state.currentPlayer == 2 && this.state.playWithPc) pl = "Computer";
    let pw = "";
    if (this.state.playWithPc) pw = "Computer";
    else pw = "Friend";
    return (
      <div>
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          Hard Level : <strong>{hl}</strong>&nbsp;&nbsp;&nbsp;&nbsp; Current
          Player : <strong>{pl}</strong>&nbsp;&nbsp;&nbsp;&nbsp; Playing With :{" "}
          <strong>{pw}</strong>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className="btn btn-danger btn-sm float-right"
            onClick={() => this.playAgain()}
          >
            Restart
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <div
            className="row border rounded mt-auto mb-auto text-white"
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
        {this.state.showDialog ? (
          <Modal onClick={(v1, v2) => this.startGame(v1, v2)}></Modal>
        ) : (
          ""
        )}
        {this.state.isGameDraw || this.state.p1won || this.state.p2won ? (
          <GameEnd
            onClick={() => this.playAgain()}
            txt={
              this.state.p1won
                ? this.state.playWithPc
                  ? "You Won!"
                  : "Player X Won!"
                : this.state.p2won
                ? this.state.playWithPc
                  ? "You Lose!"
                  : "Player O Won!"
                : this.state.isGameDraw
                ? "Game Draw!"
                : ""
            }
          ></GameEnd>
        ) : (
          ""
        )}
      </div>
    );
  }
}
