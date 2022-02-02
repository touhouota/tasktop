import React from "react";

type Props = {
  hide: boolean
  appender: Function
};

type State = {
  hide: boolean
}

class MainComponent extends React.Component<Props, State> {
  appender: Function

  constructor(props: Props) {
    super(props);
    this.appender = props.appender;
    this.state = { hide: props.hide };

    this.addTask = this.addTask.bind(this);
  }

  addTask() {
    console.log("addTask");
    this.appender({name: "追加テスト"});
  }

  render() {
    return(
      <div className="main_button">
        <button onClick={this.addTask}>タスク追加</button>
      </div>
    );
  }
}

export default MainComponent;