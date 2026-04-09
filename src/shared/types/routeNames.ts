export const RouteNames = {
  home: "home",
  lists: "lists",
  tasks: "tasks",
  analytics: "analytics",
  profile: "userProfile",
  users: "users",
  notFound: "NotFound",
  auth: "auth",
} as const;

export type RouteName = typeof RouteNames[keyof typeof RouteNames];
