/* eslint-disable */
import type { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import type { Request } from 'express';

import { ForbiddenException, createParamDecorator } from '@nestjs/common';
import { AuthorizedRequest, isLoggedRequest, User } from '../types/auth';

export const UserInfo: () => ParameterDecorator = createParamDecorator(
  (_: unknown, context: ExecutionContextHost): User => {
    const request: AuthorizedRequest | Request = context.switchToHttp().getRequest();

    if (!isLoggedRequest(request)) {
      console.error('You are trying to access user property on an unauthorized call');
      throw new ForbiddenException();
    }

    return request.user;
  },
);