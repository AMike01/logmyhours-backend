/* eslint-disable */
import type { Request } from 'express';

import { Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

import { UserToken } from '../types/auth';

@Injectable()
export class AuthService {

  getToken(req: Request): string | undefined {
    return req.headers.authorization?.replace('Bearer', '').trim();
  }

  decodeToken(token: string): UserToken | null {
    try {
      return decode(token) as UserToken | null;
    } catch (error) {
      return null;
    }
  }
}
