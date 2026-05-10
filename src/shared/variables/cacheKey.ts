export const permissionsCacheKeys = {
  permissions: "permissions",
  permissionsRoles: "permissions-roles",
} as const;

export const dashboardCacheKeys = {
  todayData: "todayData",
  upcomingData: "upcomingData",
  weeklyGoalsData: "weeklyGoalsData",
} as const;

export const analyticsCacheKeys = {
  summary: "analyticsSummary",
  popularTags: "popularTags",
  tasksByPriority: "tasksByPriority",
  dailyActivity: "dailyActivity",
} as const;
