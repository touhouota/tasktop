import React from "react";
import { ipcRenderer } from "electron";

//  Components
import CabinetCompornent from "./tasktop/cabinetComponents";
import MainComponent from "./tasktop/mainComponent"

type Props = {};

type State = {
  display: boolean;
  tasks: {
    todo: Array<Task>,
    doing: Array<Task>,
    done: Array<Task>
  }
};

type NewTask = {
  name: string
}

export class Tasktop extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      display: false,
      tasks: {
        todo: [],
        doing: [],
        done: []
      }
    };

    this.updateLoginState = this.updateLoginState.bind(this);
    this.updateLogoutState = this.updateLogoutState.bind(this);
    this.appendTaskItem = this.appendTaskItem.bind(this);
  }

  updateLoginState() {
    window.myAPI.setOAuthButtonEvent();
    this.setState({ display: true });
  }

  updateLogoutState() {
    this.setState({ display: false });
  }

  appendTaskItem(taskItem: NewTask) {
    console.log("appendTaskItem", taskItem);
    let newTask: Task = taskItem as Task;
    newTask.status = 0;

    this.setState(prevState => {
      const prev = prevState;
      prev.tasks.todo.push(newTask);

      return prev;
    })
  }

  updateTasks(task: Task) {

  }

  render() {
    if (this.state.display) {
      return (
        <div>
          <CabinetCompornent position="top" tasks={this.state.tasks.todo} />
          <CabinetCompornent position="left" />
          <CabinetCompornent position="right" />
          <button id="logout_button" onClick={this.updateLogoutState}>
            Logout Google
          </button>
          <MainComponent hide={this.state.display} appender={this.appendTaskItem} />
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
