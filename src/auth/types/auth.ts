import type { Request } from 'express';

export const isLoggedRequest = (req: AuthorizedRequest | Request): req is AuthorizedRequest => {
    return Object.keys(req).includes('user');
};

export interface AuthorizedRequest extends Request {
    user: User;
}

export class User {
    constructor(userToken: UserToken) {
        this.email = userToken.email;
        this.username = userToken['cognito:username'];
    }

    email: string;
    username: string;
}

export class UserToken {
    'custom:type': string;
    'custom:cf': string;
    sub: string;
    email_verified: string;
    address: string;
    formatted: string;
    iss: string;
    'cognito:username': string;
    given_name: string;
    origin_jti: string;
    aud: string;
    event_id: string;
    token_use: string;
    auth_time: string;
    exp: string;
    iat: string;
    family_name: string;
    jti: string;
    email: string;
}

export class RequestDetails {
    createdAt: number;
    flowExpiration: number;
    tokenExpiration: number;
    uuid: string;
}