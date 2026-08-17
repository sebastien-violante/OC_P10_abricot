import { types } from "util";

// AUTHENTIFICATION 
export type Token = string;

export type LoginResponseData = {
    user: {
        id: string;
        email: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
    token: string;
};

// INSCRIPTION 
export type RegistrationFormData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// UTILISATEUR
export type ProfileContextType = {
  profile: Profile | null
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
  loadProfile: () => Promise<void>
}

export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type Profile = Pick<User, "id" | "email" | "name">;

export type Assignee = {
    id: string;
    userId: string;
    taskId: string;
    user: User;
    assignedAt: string
}

// PROJET
export type Project = {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    owner: User;
    members: Member[];
    createdAt: string;
    updatedAt: string;
    tasks?: Task[];
}

export type Member = {
    id: string;
    joinedAt: string;
    projectId: string;
    role: string;
    user: User;
}
// TACHE 

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
    id?: string;
    title : string;
    description : string;
    status? : TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    projectId? : string;
    creatorId?: string;
    assignees? : Assignee[];
    comments?: Comment[];
    createdAt? : string;
    updatedAt? : string;
    project?: Project;
}

export type TaskIa = Pick<Task, "title" | "description">;

export type TasksResponse = {
    success: boolean;
    message: string;
    data: {
        tasks: Task[];
    };
}

// COMMENTAIRE
export type Comment = {
    id : string;
    content : string;
    taskId : string;
    authorId: string;
    author: User;
    createdAt : string;
    updatedAt: string;
}

// TYPES DE FORMULAIRE
type BaseInput = {
    name: string;
    label: string;
    required: boolean;
}

export type TextInput = BaseInput & {
    type: "text";
    defaultValue?: string;
}

export type EmailInput = BaseInput & {
    type: "email";
    defaultValue?: string;
}

export type DateInput = BaseInput & {
    type: "date";
    defaultValue?: string;
}

export type CollaboratorInput = BaseInput & {
    type: "collaborators";
}

export type UserInput = BaseInput & {
    type: "user";
}

export type StatusInput = BaseInput & {
    type: "status";
    options: {
        label: string;
        value: TaskStatus;
    }[];
}

export type CustomInput = | TextInput | DateInput | CollaboratorInput | UserInput | StatusInput | EmailInput;

export type UserFormData = {
    lastName: string;
    firstName: string;
    email: string;
}

export type AuthFormData = {
    email: string;
    password: string;
}

export type registerFormData = {
    name: string;
    email: string;
    password: string;
}

export type UserPasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type TaskFormData = {
    formTitle: string;
    ctaLabel: string;
    title: string;
    description: string;
    mode: boolean;
    contributors: User[];
    dueDate: string;
    status: string;
    edit: boolean;
    taskId?: string;
}

export type ProjectFormData = {
    formTitle?: string;
    name: string;
    ctaLabel: string;
    mode: boolean;
    description: string;
    contributors: User[];
}

// REPONSES API
export type ApiResponse<T = unknown> = { 
    success: boolean; 
    message: string; 
    data?: T; 
    error?: string; 
    details?: ApiErrorDetail[]; 
};


export type ProjectResponse = {
    success: boolean;
    message: string;
    data: {
        projects: Project[];
    }
}

export type SingleProjectResponse = {
    success : boolean;
    message : string;
    data : {
        tasks : Task[];
    }
}

export type ApiError = {
    status: number;
    message: string;
    error?: string;
    details?: ApiErrorDetail[];
};

export type ApiErrorDetail = { 
    field: string; 
    message: string; 
} 


export type UpdateProjectResponse = {
    project: Project;
}

export type UpdateTaskResponse = {
    task: Task;
}

export type UserResponse = {
    success: boolean;
    message: string;
    data: {
        users: User[]
    }
}

// AUTRES TYPES
export type KanbanLists = {
    todoTasks : Task[];
    inProgressTasks : Task[];
    doneTasks : Task[];
}

export type FlashMessage = {
    status: boolean
    message: string
}