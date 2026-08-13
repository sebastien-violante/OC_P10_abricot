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

// ok
export type RegistrationFormData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    //type?: string;
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

export type TaskIa = {
    titre : string;
    description : string;
}

export type TasksResponse = {
    success: boolean;
    message: string;
    data: {
        tasks: Task[];
    };
}

export type UserResponse = {
    success: boolean;
    message: string;
    data: {
        users: User[]
    }
}

export type KanbanLists = {
    todoTasks : Task[];
    inProgressTasks : Task[];
    doneTasks : Task[];
}



export type Owner = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type Member = {
    id: string;
    role: string;
    user : User;
    joinedAt: string;
}

export type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type ProfileContextType = {
  profile: Profile | null
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
  loadProfile: () => Promise<void>
}

export type Profile = {
    email: string;
    id: string;
    name: string;
}

// TYPES REMIS AU PROPRE

export type TextInput = {
    type: "text";
    name: string;
    label: string;
    required: boolean;
    defaultValue?: string;
}

export type EmailInput = {
    type: "email";
    name: string;
    label: string;
    required: boolean;
    defaultValue?: string;
}

export type DateInput = {
    type: "date";
    name: string;
    label: string;
    required: boolean;
    defaultValue?: string;
}

export type CollaboratorInput = {
    type: "collaborators";
    name: string;
    label: string;
    required: boolean;
}


export type UserInput = {
    type: "user";
    name: string;
    label: string;
    required: boolean;
};

export type StatusInput = {
    type: "status";
    name: string;
    label: string;
    required: boolean;
    options: {
        label: string;
        value: string;
    }[];
};

export type CustomInput = | TextInput | DateInput | CollaboratorInput | UserInput | StatusInput | EmailInput;

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

export type Project = {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    owner: Owner;
    members: Member[];
    createdAt: string;
    updatedAt: string;
    tasks?: Task[];
}

export type ProjectFormData = {
    formTitle?: string;
    title: string;
    ctaLabel: string;
    mode: boolean;
    description: string;
    collaborators: User[];
}


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
    collaborators: User[];
    dueDate: string;
    status: string;
    edit: boolean;
    taskId?: string;
}

export type FlashMessage = {
    status: boolean
    message: string
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

export type ApiResponse<T = unknown> = { 
    success: boolean; 
    message: string; 
    data?: T; 
    error?: string; 
    details?: ApiErrorDetail[]; 
};

export type UpdateProjectResponse = {
    project: Project;
}
