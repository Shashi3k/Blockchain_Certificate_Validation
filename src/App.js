import { Route, Router } from "react-router-dom";
// import NavBar from "./component/NavBar/NavBar";
import FileCertificatorPage from "./component/FileCertificatorPage/FileCertificatorPage";

const { Component } = require("react");


class App extends Component{

  render(){
    return(
      <div className="App">
        {/* <NavBar /> */}
        <FileCertificatorPage />
        <footer>
          <p className={"footerText"}>
          © 2021 TIET | Made by Capstont Team 9
          </p>
        </footer>
      </div>
    )
  }
}

export default App;