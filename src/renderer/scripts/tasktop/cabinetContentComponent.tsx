import React from "react";

type Props = {
  position: string;
  isOpened: boolean;
};

class CabinetContentComponent extends React.Component<Props> {
  styleClassList: Array<string>;

  constructor(props: Props) {
    super(props);

    this.styleClassList = ["cabinet_content"];
    this.renderClasses = this.renderClasses.bind(this);
  }

  renderClasses(): string {
    const { isOpened } = this.props;

    if (isOpened) {
      this.styleClassList = this.styleClassList.filter(
        (item) => item.match(/hide/) === null,
      );
    } else {
      this.styleClassList.push("hide");
    }

    return this.styleClassList.join(" ");
  }

  render() {
    const { position } = this.props;

    return <div className={this.renderClasses()}>{position} content</div>;
  }
}

export default CabinetContentComponent;
