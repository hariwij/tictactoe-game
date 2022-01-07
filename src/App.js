import logo from "./logo.svg";
import "./App.css";
import Gameboard from "./Gameboard";

function App() {
  return (
    <div
      className="container"
      style={{ height: "100vh" }}
    >
      <Gameboard></Gameboard>
    </div>
  );
}

export default App;
