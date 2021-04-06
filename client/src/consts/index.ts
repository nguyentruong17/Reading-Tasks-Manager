import { TaskPriority, TaskStatus } from "gql/generated/gql-types";

///graphql
export const GQL_ENDPOINT = "http://localhost:3000/graphql";

////book.service
export const DEFAULT_BOOKS_PER_REQUEST = 10;

export const DEFAULT_ONLINE_BOOKS_PER_QUERY = 5;

////task.service
export const DEFAULT_TASK_HISTORY_PER_REQUEST = 5;

////user module
export const DEFAULT_USER_TASKS_PER_QUERY = 5;

export const Priorities: {
  [key: string]: {
    name: string,
    value: TaskPriority
  }
} = {
  None: { name: "None", value: TaskPriority.None },
  Low: { name: "Low", value: TaskPriority.Low },
  Medium: { name: "Medium", value: TaskPriority.Medium },
  High: { name: "High", value: TaskPriority.High },
  Critical: { name: "Critical", value: TaskPriority.Critical },
};
export const Status: {
  [key: string]: {
    name: string,
    value: TaskStatus,
    color: string
  }
} = {
  New: {
    name: "New",
    value: TaskStatus.New,
    color: "rgb(222, 231, 235)",
  },
  "In Progress": {
    name: "In Progress",
    value: TaskStatus.InProgress,
    color: "rgb(243, 238, 180)",
  },
  Done: {
    name: "Done",
    value: TaskStatus.Done,
    color: "rgb(219, 203, 240)",
  },
  Postpone: {
    name: "Postpone",
    value: TaskStatus.Postpone,
    color: "rgb(210, 238, 214)",
  },
};
