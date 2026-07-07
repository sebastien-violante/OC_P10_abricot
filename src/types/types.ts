export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type Token = string;

export type AuthenticateData = {
    user: User;
    token: string;
}

export type Detail = {
    field: string;
    message: string;
}

export type Details = Detail[]

export type AuthenticateResult = {
    success: boolean;
    error?: string;
    message: string;
    data?: AuthenticateData;
    details?: Details;
}

export type FormData = {
    email: string;
    password: string;
    name?: string;
    type?: string;
}

export type FormErrors = {
    email?: string;
    password?: string;
    name?: string;
}

export type FetchErrors = string

export type FetchSuccessData = {
    data: {
        token: string;
    }
    user?: {
        email: string;
    };
};

export type Project = {
    id: string;
    name: string;
    description: string;
}

export type Assignee = {
    id: string;
    userId: string;
    taskId: string;
    user: User;
    assignedAt: string
}

export type Author = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export type Comment = {
    id : string;
    content : string;
    taskId : string;
    authorId: string;
    author: Author;
    createdAt : string;
    updatedAt: string;
}

export type Task = {
    id: string;
    title : string;
    description : string;
    status : "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
    projectId : string;
    creatorId: string;
    assignees : Assignee[];
    comments: Comment[];
    createdAt : string;
    updatedAt : string;
    project: Project;
}

export type TasksResponse = {
     success: boolean;
    message: string;
    data: {
        tasks: Task[];
    };
}

export type KanbanLists = {
    todoTasks : Task[];
    inProgressTasks : Task[];
    doneTasks : Task[];
}