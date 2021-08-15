import React from "react";
import { ipcRenderer } from "electron";

//  Components
import CabinetCompornent from "./tasktop/cabinetComponents";

type Props = {};

type State = {
  display: boolean;
};

export class Tasktop extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      display: false,
    };

    this.updateLoginState = this.updateLoginState.bind(this);
    this.updateLogoutState = this.updateLogoutState.bind(this);
  }

  updateLoginState() {
    window.myAPI.setOAuthButtonEvent();
    this.setState({ display: true });
  }

  updateLogoutState() {
    this.setState({ display: false });
  }

  render() {
    if (this.state.display) {
      return (
        <div>
          <CabinetCompornent position="top" />
          <CabinetCompornent position="left" />
          <CabinetCompornent position="right" />
          <button id="logout_button" onClick={this.updateLogoutState}>
            Logout Google
          </button>
        </div>
      );
    }

    return (
      <button id="login_button" onClick={this.updateLoginState}>
        Login Google
      </button>
    );
  }
}
