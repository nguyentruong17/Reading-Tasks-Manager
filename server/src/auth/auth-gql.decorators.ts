import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { BaseUserMongo } from 'src/user/user.model';

//https://docs.nestjs.com/security/authentication#graphql
export const CurrentUser = createParamDecorator<BaseUserMongo>(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as BaseUserMongo;
    // console.log(user)
    // if (!user) {
    //   throw new UnauthorizedException()
    // }
    return user;
  },
);
