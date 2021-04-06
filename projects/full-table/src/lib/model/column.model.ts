export interface ColumnModel {
  def: string;
  name: string;
  value: {type: string, icon?: string, filter?: ((e: any) => boolean)}[] | ((e: any) => string);
  type?: string;
  filterDefault?: {title: string, value: string}[];
  sort?: boolean;
}
