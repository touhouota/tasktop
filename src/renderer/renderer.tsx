import React from "react";
import ReactDOM from "react-dom";

//  Components
import CabinetCompornent from "./scripts/cabinetComponents.tsx";

// StyleSheet
import "./style/main.scss";

ReactDOM.render(
  <div>
    <CabinetCompornent position={"top"} />
    <CabinetCompornent position={"left"} />
    <CabinetCompornent position={"right"} />
  </div>,
  document.getElementById("container")
);
