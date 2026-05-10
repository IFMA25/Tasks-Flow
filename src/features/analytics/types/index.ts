import { periodAnalitics } from "../variable";

export interface AnalyticsSummaryResponse {
   lists: {
    total: number;
  };
  tasks: {
    total: number;
    completed: number;
    archived: number;
    todo: number;
    inProgress: number;
  };
}

export interface PopularTagsResponse {
  tag: string;
  count: number;
}

export interface TasksByPriorityResponse {
  priority: string;
  count: number;

}

export interface DailyActivityResponse {
  date: string;
  created: number;
  completed: number;
}

export type PeriodAnalytics = (typeof periodAnalitics)[number];
