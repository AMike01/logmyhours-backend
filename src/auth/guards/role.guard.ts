/* eslint-disable */
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { isDefined, isStringDefined } from '../../utils';

import { AuthService } from '../auth/auth.service';
import { AuthorizedRequest, User, UserToken } from '../types/auth';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token: string | undefined = this.authService.getToken(request);

    if (isStringDefined(token)) {
      const decoded: UserToken | null = this.authService.decodeToken(token);
      if (!isDefined(decoded)) {
        throw new UnauthorizedException();
      }

      const userData: UserToken = decoded;

      if (!isDefined((request as AuthorizedRequest).user)) {
        let user: User = new User(userData);
        (request as AuthorizedRequest).user = user;
      }
    }

    return true;
  }
}
