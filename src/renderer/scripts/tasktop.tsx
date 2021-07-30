import React from "react";

//  Components
import CabinetCompornent from "./tasktop/cabinetComponents";

type Props = {};

export class Tasktop extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CabinetCompornent position="top" />
        <CabinetCompornent position="left" />
        <CabinetCompornent position="right" />
      </div>
    );
  }
}
