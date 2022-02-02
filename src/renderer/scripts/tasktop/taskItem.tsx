import React from "react";

type Props = {

}

type State = {
    status: TaskStatus
}

export class TaskItem extends React.Component<Props, State> {
    constructor(props: Props) {
        console.log("TaskItem");

        super(props);
        this.state = {
            status: 0
        }
    }

    updateState(nextState: State) {
        this.setState(nextState);
    }

    render() {
        const taskName = "定型タスク";

        return (
            <div className="task_item" data-status={this.state.status}>
                <p className="task_name">{taskName}</p>
                <p>status: {this.state.status}</p>
            </div>
        );
    }
}