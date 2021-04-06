export interface ColumnModel {
  def: string;
  name: string;
  value: any;
  type?: string;
  filterDefault?: {title: string, value: string}[];
  sort?: boolean;
}
