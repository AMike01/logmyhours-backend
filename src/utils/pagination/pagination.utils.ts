import type { PaginationQuery, PaginationSkipQuery } from './dto/pagination.args';
import type { ItemListInterface, PaginationInfo } from './dto/pagination.objects';
import type { PipelineStage } from 'mongoose';

const NB_ELEMENT_TO_HAVE_HAS_NEXT: number = 1;

export function getSkipFromPagination(pagination: PaginationQuery): PaginationSkipQuery {
  return {
    skip: pagination.limit * pagination.start,
    limit: pagination.limit,
  };
}

export function getPageForHasNext(page: PaginationQuery): PaginationQuery {
  return {
    ...page,
    limit: page.limit + NB_ELEMENT_TO_HAVE_HAS_NEXT,
  };
}

export function getAggregationPagination(page: PaginationQuery): PipelineStage[] {
  return [
    {
      $skip: page.start * (page.limit - 1), // for pageForHasNext
    },
    {
      $limit: page.limit,
    },
  ];
}

export function getItemList<T>(
  page: PaginationQuery,
  items: T[],
  totalCount?: number,
  forcePageInfo?: Partial<PaginationInfo>,
): ItemListInterface<T> {
  const hasPrevious: boolean = page.start > 0 && items.length > 0;
  const hasNext: boolean = items.length > page.limit;
  const count: number = hasNext ? page.limit : items.length;
  const itemsNew: T[] = hasNext
    ? items.slice(0, page.limit)
    : items;

  return {
    totalCount,
    paginationInfo: {
      start: page.start,
      limit: page.limit,
      count,
      hasPrevious,
      hasNext,
      ...(forcePageInfo ?? {}),
    },
    items: itemsNew,
  };
}
