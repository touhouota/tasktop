type Task = {
    name: string,
    status: TaskStatus
}

const enum TaskStatus {
    todo = 0,
    doing = 1,
    done = 2,
    waiting = 3,
}