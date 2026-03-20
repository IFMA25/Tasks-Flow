export const listsTabs = {
  myLists: "myLists",
  usersLists: "usersLists",
} as const;

export type ListTab = typeof listsTabs[keyof typeof listsTabs];
