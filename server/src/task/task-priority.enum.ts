import { registerEnumType } from '@nestjs/graphql';

export enum TaskPriority {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
  valuesMap: {
    NONE: {
      description: 'The default status.',
    },
  },
});
