import React, { Ref } from "react";

type Props = {
  hide: boolean
  appender: Function
};

type State = {
  hide: boolean
}

class MainComponent extends React.Component<Props, State> {
  appender: Function
  appendTaskName?: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);
    this.appender = props.appender;
    this.state = { hide: props.hide };

    this.addTask = this.addTask.bind(this);
  }

  addTask() {
    if(!this.appendTaskName) return null;

    this.appender({name: this.appendTaskName.value});
    this.appendTaskName.value = "";
  }

  render() {
    return(
      <div className="main_button">
        <input type="text" ref={ input => {this.appendTaskName = input}} />
        <button onClick={this.addTask}>タスク追加</button>
      </div>
    );
  }
}

export default MainComponent;