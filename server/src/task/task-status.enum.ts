import { registerEnumType } from "@nestjs/graphql";

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  POSTPONE = 'POSTPONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  valuesMap: {
    OPEN: {
      description: 'The default status.',
    },
  },
});
