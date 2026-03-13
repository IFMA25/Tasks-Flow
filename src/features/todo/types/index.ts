export interface ListsResponse {
  data: ListData[];
  pagination: PaginationData;
}

export interface ListData {
  id: string;
  title: string;
  owner: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  completedTasks: number;
  hexColor: string;
  tasks: TasksData[];
}

interface PaginationData {
  total: number
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

interface TasksData {
  id: string;
  title: string;
  status: string;
  isWeeklyGoal: boolean;
}
interface ListInfo {
  createdAt: string;
  deadline: string | null;
  hexColor: string;
  id: string;
  ownerId: string;
  title: string;
  updatedAt: string;
}

export interface RequestBodyListData {
  title: string;
  hexColor: string;
}

export interface TasksResponse {
  data: TaskData[];
  listInfo: ListInfo;
  pagination: PaginationData;
}

export interface TaskData {
  id: string;
  listId: string;
  title: string;
  description: string;
  longDescription: string;
  status: string;
  priority: string;
  order: number;
  tags: string[];
  isStarred: boolean;
  dueDate: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestBodyTaskData {
  title: string;
  priority: string;
  tags: string[];
  dueDate: string;
  description?: string;
  longDescription?: string;
  status?: string;
  deadline?: string;
  isStarred?: boolean;
  isWeeklyGoal?: boolean;
  order?: number;
}

export interface RequestCompletedTask {
  completed: boolean;
}


export interface ListsParams {
  limit: number;
  q: string;
  sort: string;
  order: string;
  isOwn: boolean;
}