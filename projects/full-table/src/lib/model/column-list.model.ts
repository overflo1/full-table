export interface ColumnListEntityModel {
  def: string;
  name: string;
  value: {type: string}[] | ((e) => string);
  type?: string;
  filterDefault?: {title: string, value: string}[];
  sort?: boolean;
}
