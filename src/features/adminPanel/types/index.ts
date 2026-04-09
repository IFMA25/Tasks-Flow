export interface Permission {
  key: string;
  value: string;
  category: string;
  description: string;
}

export type PermissionRole = {
  ADMIN: string[];
  USER: string[];
};

export interface DeleteResponse {
  message: string;
}

export interface Category {
  key: string;
  value: string[];
  label: string;
}
