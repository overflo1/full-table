export interface GetManyModel<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
