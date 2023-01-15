export enum PageError {
  PageNotExist = '존재하지 않는 페이지 입니다.',
  LimitMustBeNaturalNumber = 'limit은 1이상의 자연수 입니다',
}

export class PageDto {
  total: number;
  current: number;
}
