import { Module, forwardRef } from '@nestjs/common';

import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  providers: [
    AuthService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule { }
