export const RouteNames = {
  home: "home",
  lists: "lists",
  analytics: "analytics",
  profile: "userProfile",
  users: "users",
  notFound: "NotFound",
  auth: "auth",
} as const;

export type RouteName = typeof RouteNames[keyof typeof RouteNames];
