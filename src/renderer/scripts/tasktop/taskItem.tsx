import React from "react";

type Props = {
    name: string,
    status: TaskStatus
}

type State = {
    status: TaskStatus
}

class TaskItem extends React.Component<Props, State> {
    name: string;

    constructor(props: Props) {
        super(props);

        this.name = props.name;
        this.state = {
            status: props.status
        }
    }

    updateState(nextState: State) {
        this.setState(nextState);
    }

    render() {
        return (
            <div className="task_item" data-status={this.state.status}>
                <p className="task_name">{this.name}</p>
                <p>status: {this.state.status}</p>
            </div>
        );
    }
}

export default TaskItem;