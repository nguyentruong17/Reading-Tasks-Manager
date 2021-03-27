import { registerEnumType } from "@nestjs/graphql";

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  POSTPONE = 'POSTPONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  valuesMap: {
    NEW: {
      description: 'The default status.',
    },
  },
});
