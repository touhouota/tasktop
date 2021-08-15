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

    const { position } = this.props;

    this.styleClassList = [`${position}_cabinet`];
    this.cabinetToggle = this.cabinetToggle.bind(this);
    this.renderClasses = this.renderClasses.bind(this);
  }

  cabinetToggle(): void {
    this.setState((prevState) => ({
      isOpened: !prevState.isOpened,
    }));
  }

  renderClasses(): string {
    const { isOpened } = this.state;
    const { position } = this.props;
    if (isOpened) {
      this.styleClassList = this.styleClassList.filter(
        (item) => item.match(/hide/) === null
      );

      if (position === "top") {
        this.styleClassList.push("open_cabinet_top");
      } else {
        this.styleClassList.push("open_cabinet_side");
      }
    } else {
      this.styleClassList = this.styleClassList.filter(
        (item) => item.match(/open/) === null
      );

      if (position === "top") {
        this.styleClassList.push("hide_top_content");
      } else {
        this.styleClassList.push("hide_side_content");
      }
    }

    return this.styleClassList.join(" ");
  }

  render() {
    const { position } = this.props;
    const { isOpened } = this.state;

    return (
      <div className={this.renderClasses()}>
        <div className="cabinet_tab" onClick={this.cabinetToggle}>
          {position} is {isOpened ? "Open" : "Close"}
        </div>
        <CabinetContentComponent position={position} isOpened={isOpened} />
      </div>
    );
  }
}

export default CabinetComponent;
