/* eslint-disable */
import type { Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

// TODO IMPROV we could make this function generic and add default mocks for all the functions, but it's a lot of work
export function getMongooseModelProvider(token: string): Provider {
  return {
    provide: getModelToken(token),
    useValue: {
      new: jest.fn(),
      constructor: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      exec: jest.fn(),
    },
  };
}
