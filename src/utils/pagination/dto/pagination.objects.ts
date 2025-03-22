import type { ClassType } from 'class-transformer-validator';

import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginationInfo {
  @ApiProperty()
  count: number;
  @ApiProperty()
  start: number;
  @ApiProperty()
  limit: number;
  @ApiProperty({ required: false })
  hasNext?: boolean;
  @ApiProperty({ required: false })
  hasPrevious?: boolean;
}

/* export abstract class ItemList<T> {
     @ApiProperty()
     totalCount?: number;
     @ApiProperty()
     paginationInfo: PaginationInfo;
     items: T[];
   } */

export abstract class ItemListInterface<T> {
  totalCount?: number;
  paginationInfo: PaginationInfo;
  items: T[];
}

type ArrayElements<TArray extends readonly any[]> =
  TArray extends ReadonlyArray<infer TElement> ? TElement : never;

type UnionFromClasses<TClassesArray extends readonly any[]> =
  InstanceType<ArrayElements<TClassesArray>>;

/**
 * Object ItemList
 *
 * Keep for Swagger generation and avoid circular dependencies without TItemClass type as input
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */
export function ItemList<TItem>(
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-redundant-type-constituents
  TItemClass: ClassType<TItem> | UnionFromClasses<[TItem]>,
) {
  abstract class ItemListClass implements ItemListInterface<TItem> {
    @ApiProperty({ required: false })
    totalCount?: number;
    @ApiProperty()
    paginationInfo: PaginationInfo;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @ApiProperty({ type: () => [TItemClass] })
    items: TItem[];
  }

  return ItemListClass;
}
