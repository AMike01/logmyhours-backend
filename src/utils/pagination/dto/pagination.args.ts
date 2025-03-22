/* eslint-disable */
import type { TransformFnParams } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { isDefined } from 'src/utils/common.utils';

function getIntTransformWithDefault(def: number): (params: TransformFnParams) => number | undefined {
  return (params: TransformFnParams): number | undefined => {
    if (!isDefined(params.value)) {
      return undefined;
    }
    const value: number = parseInt(params.value as string, 10);
    if (isNaN(value)) {
      return def;
    }

    return value;
  };
}

export function numberTransform(params: TransformFnParams): number | undefined {
  if (!isDefined(params.value)) {
    return undefined;
  }

  const value: number = parseInt(params.value as string, 10);

  if (isNaN(value)) {
    return undefined;
  }

  return value;
}

export class PaginationSkipQuery {
  skip: number = 0;
  limit: number = 10;
}
export class PaginationQuery {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(getIntTransformWithDefault(0))
  start: number = 0;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(getIntTransformWithDefault(10))
  limit: number = 10;
}

