# FullTable

This library let you use the component `<lib-full-table>` that provides you a sortable, pageable, filterable angular material table which generates automatic queries based on [nestjs/crud](https://github.com/nestjsx/crud).

## Setup

Add `import {FullTableModule} from '@overflo-srl/full-table';` in your module. You also need to add your backend endpoint into `FullTableModule.forRoot(*** BASE_URL ***)`.
> Note: you can also add enviromend variable like `FullTableModule.forRoot(enviroment.BASE_PATH)`

## Parameters

To generate the table you need to enter basic information for your entity:

`[PATH]: base path for your nestjs/crud entity ('/book)`

`[columnList]: description and settings for your columns (ColumnListModel[])`

```
interface ColumnListModel {
  def: string;
  name: string;
  value: {type: string, icon: string, filter: ((e: any) => boolean)}[] | ((e: any) => string);
  type?: string;
  filterDefault?: {title: string, value: string}[];
  sort?: boolean;
  hidden?: boolean
}
```

OPTIONALS:

`(data): event emitter that emit the array of the showed entities everytime there is an update in the table`

`[columnMobile]: description and settings for your column responsive mobile column (() => string)`

`[actions]: action event emitter that emits when there is an event on the table (refresh every time a value is emitted)`

`[search]: search query based on nestjs/crud`

`[join]: join query based on nestjs/crud`

`[defaultSort]: default sort column query based on nestjs/crud`

`[defaultFilter]: {name: string, operation?: string, value: string | number}[] default filter chip putted at table startup. (can be removed)`

`[pageSize]: page size number (default: 5)`
