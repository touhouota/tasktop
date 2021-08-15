import React from "react";
import ReactDOM from "react-dom";

import { Tasktop } from "./scripts/tasktop";

// StyleSheet
import "./style/main.scss";

ReactDOM.render(<Tasktop />, document.getElementById("container"));

window.onload = () => {
  const button = document.getElementById("login_button");
  window.myAPI.setOAuthButtonEvent();
};
