export interface Option {
  [key: string]: unknown;
}

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface RoleOption extends Option {
  key: string;
  label: string;
  value: string | undefined;
}

export interface SortOption extends Option {
  key: string;
  label: string;
  params: {
    sort: string;
    order: "asc" | "desc";
  };
}

export interface PriorityOption extends Option {
  key: string;
  label: string;
  params: {
    priority: string;
  };
}

export type ActionKey = "edit" | "delete";

export interface Actions {
  key: ActionKey;
  label: string;
}

export interface TaskActionConfig {
    key: ActionKey;
    label: string;
    permission: string;
  }
