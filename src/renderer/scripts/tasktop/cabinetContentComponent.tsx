import React from "react";

// Components
import TaskItem from "./taskItem"

type Props = {
  position: string;
  isOpened: boolean;
  tasks?: Task[]
};

type State = {
  tasks: Task[]
}

class CabinetContentComponent extends React.Component<Props, State> {
  styleClassList: Array<string>;

  constructor(props: Props) {
    super(props);
    this.state = { tasks: props.tasks || [] }

    this.styleClassList = ["cabinet_content"];
    this.renderClasses = this.renderClasses.bind(this);
  }

  renderClasses(): string {
    const { isOpened } = this.props;

    let tempClassList = [];

    if (isOpened) {
      this.styleClassList = this.styleClassList.filter(
        (item) => item.match(/hide/) === null,
      );
    } else {
      tempClassList.push("hide");
    }

    return this.styleClassList.join(" ");
  }

  createTasks() {
    return this.state.tasks.map( task => <li>{task.name}</li>)
  }

  render() {
    const { position } = this.props;

    return (
      <div className={this.renderClasses()}>
        {position} content
        {this.createTasks()}
        </div>
    );
  }
}

export default CabinetContentComponent;
