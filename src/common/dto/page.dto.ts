import { DEFAULT_LIMIT } from 'src/common/common.constants';

export enum PageError {
  PageNotExist = '존재하지 않는 페이지 입니다.',
  LimitMustBeNaturalNumber = 'limit은 1이상의 자연수 입니다',
}

export class PageDto {
  total: number;
  current: number;
}

export function getPageInfo(count: number, limit?: number, page?: number) {
  return {
    total: Math.ceil(count / (limit ?? DEFAULT_LIMIT)),
    current: page ?? 1,
  };
}
