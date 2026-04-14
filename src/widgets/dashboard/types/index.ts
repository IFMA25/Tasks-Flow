export interface DashboardList {
  deadline: string | null;
  hexColor: string | null;
  id: string;
  title: string;
}

export interface DashboardTask {
  completedAt: string | null;
  createdAt: string;
  deadline: string;
  deletedAt: string | null;
  dueDate: string;
  id: string;
  isStarred: boolean;
  isWeeklyGoal: boolean;
  listId: DashboardList;
  order: number;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface DashboardData {
  data: DashboardTask[];
  total: number;
}
