import React from "react";
import CabinetContentComponent from "./cabinetContentComponent";

type Props = {
  position: string;
};

type State = {
  isOpened: boolean;
};

class CabinetComponent extends React.Component<Props, State> {
  styleClassList: Array<string>;

  constructor(props: Props) {
    super(props);
    this.state = { isOpened: false };

    this.styleClassList = [`${this.props.position}` + "_cabinet"];
    this.cabinetToggle = this.cabinetToggle.bind(this);
    this.renderClasses = this.renderClasses.bind(this);
  }

  cabinetToggle(): void {
    this.setState((prevState) => ({
      isOpened: !prevState.isOpened,
    }));
  }

  renderClasses(): string {
    if (this.state.isOpened) {
      this.styleClassList = this.styleClassList.filter(
        (item) => item.match(/hide/) === null
      );

      if (this.props.position === "top") {
        this.styleClassList.push("open_cabinet_top");
      } else {
        this.styleClassList.push("open_cabinet_side");
      }
    } else {
      this.styleClassList = this.styleClassList.filter(
        (item) => item.match(/open/) === null
      );

      if (this.props.position === "top") {
        this.styleClassList.push("hide_top_content");
      } else {
        this.styleClassList.push("hide_side_content");
      }
    }

    return this.styleClassList.join(" ");
  }

  render() {
    console.log(`parent: ${this.state.isOpened}`);

    return (
      <div className={this.renderClasses()}>
        <div className="cabinet_tab" onClick={this.cabinetToggle}>
          {this.props.position} is {this.state.isOpened ? "Open" : "Close"}
        </div>
        <CabinetContentComponent
          position={this.props.position}
          isOpened={this.state.isOpened}
        />
      </div>
    );
  }
}

export default CabinetComponent;
