export type Option = Record<string, unknown>;

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

export interface Actions {
  key: string;
  label: string;
}

export interface RoleOption {
  label: string;
  value: string | undefined;
  [key: string]: unknown;
}

export interface SortOption {
  key: string;
  label: string;
  params: {
    sort: string;
    order: "asc" | "desc";
  };
  [key: string]: unknown;
}


export type ActionKey = "edit" | "delete";

export interface Action {
  key: ActionKey;
  label: string;
}
