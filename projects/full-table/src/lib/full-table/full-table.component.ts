import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {QueryJoin, QueryJoinArr, QuerySort, RequestQueryBuilder, SCondition} from '@nestjsx/crud-request';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {catchError, filter, map, startWith, switchMap} from 'rxjs/operators';
import {ColumnListModel} from '../model/column-list.model';
import {GetManyModel} from '../model/get-many.model';
import {FullTableDialogComponent} from '../full-table-dialog/full-table-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'lib-full-table',
  templateUrl: `./full-table.component.html`,
  styleUrls: ['./full-table.component.scss']
})
export class FullTableComponent<T> implements OnInit, OnChanges, AfterViewInit {

  @Input() path!: string;
  @Input() BASE_PATH!: string;
  @Input() columnList!: ColumnListModel[];
  @Input() columnMobile?: any;
  @Input() actions = new EventEmitter<void | { type: string, element: T }>();
  @Input() search: SCondition = {};
  @Input() join?: QueryJoin | QueryJoinArr | (QueryJoin | QueryJoinArr)[];
  @Input() defaultSort?: QuerySort;
  @Input() pageSize?: number;
  @Output() data = new EventEmitter<any[]>();

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  elementList: T[] = [];
  displayedColumns!: string[];
  elementLenght = 0;
  loading = true;

  isMobileLayout = window.innerWidth < 600;

  filterForm: FormGroup;

  filteredColumnsForm$ = new Observable();
  chipList: {column: string, operation: string, value: any}[] = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.filterForm = fb.group({
      column: [''],
      operation: ['='],
      value: [''],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobileLayout = event.target.innerWidth < 600;
  }

  ngOnInit(): void {
    if (!this.columnMobile) {
      this.columnMobile = this.columnList[0];
    }
    if (!this.pageSize) {
      this.pageSize = 5;
    }
    if (!this.actions) {
      this.actions = new EventEmitter<void | { type: string, element: any }>();
    }
    // FILTER FORM THINGS
    const columControl = this.filterForm.get('column');
    if (columControl) {
      this.filteredColumnsForm$ = columControl.valueChanges.pipe(
        startWith(''),
        map(value =>
          this.columnList.filter((col: { name: string; def: string; }) =>
            col.name.toLowerCase().includes(value ? value.toLowerCase() : '') && col.def !== 'actions'
          )
        )
      );
    }
    this.displayedColumns = this.columnList.map(x => x.def);
    this.paginator._intl.firstPageLabel = 'prima pagina';
    this.paginator._intl.itemsPerPageLabel = 'elementi per pagina';
    this.paginator._intl.lastPageLabel = 'ultima pagina';
    this.paginator._intl.nextPageLabel = 'pagina successiva';
    this.paginator._intl.previousPageLabel = 'pagina precedente';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) =>
      `${page * pageSize + 1} - ${page * pageSize + pageSize > length ? length : page * pageSize + pageSize} di ${length}`;
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.actions)
      .pipe(
        filter((a: any) => {
          return a === undefined || !('type' in a);
        }),
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.getData(
            this.sort.active, this.sort.direction.toUpperCase(), this.paginator.pageSize, this.paginator.pageIndex, this.search);
        }),
        map(data => {
          this.loading = false;
          this.elementLenght = data.total;
          this.data.emit(data.data);
          return data.data;
        }),
        catchError(() => {
          this.loading = false;
          return of([]);
        })
      ).subscribe((data: T[]) => this.elementList = data);
    const columnControl = this.filterForm.get('column');
    if (columnControl) {
      columnControl.valueChanges.subscribe(() => {
        // for boolean init false
        const valueControl = this.filterForm.get('value');
        if (valueControl) {
          if (this.getFilterColumnType() === 'boolean' && !valueControl.value) {
            valueControl.setValue(false);
          }
        }
      });
    }
  }

  getData(sort: string, order: string, limit: number, page: number, search: SCondition): Observable<GetManyModel<T>> {
    let qbSort: QuerySort = {field: 'id', order: 'DESC'};
    if (sort) {
      qbSort = {field: sort, order: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'};
    } else if (this.defaultSort) {
      qbSort = this.defaultSort;
    }
    const qb = RequestQueryBuilder.create({
      sort: qbSort,
      page: page + 1,
      limit,
      resetCache: true
    });
    if (this.search) {
      qb.search(search);
    }
    if (this.chipList) {
      let s: any = {};
      for (const f of this.chipList) {
        const cl = this.columnList.find(c => c.name === f.column);
        if (cl) {
          s[cl.def] = this.getSearchOperation(f.operation, f.value);
        } else {
          s[f.column] = this.getSearchOperation(f.operation, f.value);
        }
      }
      s = {...search, ...s};
      console.log('filters ', s);
      qb.search(s);
    }
    if (this.join) {
      qb.setJoin(this.join);
    }
    const requestUrl =
      `${this.BASE_PATH}/${this.path}?${qb.query()}`;
    return this.http.get<GetManyModel<T>>(requestUrl);
  }

  getSearchOperation(op: string, value: any): SCondition {
    switch (op) {
      case '!=':
        return {$ne: value};
      case '>':
        return {$gt: value};
      case '>=':
        return {$gte: value};
      case '<':
        return {$lt: value};
      case '<=':
        return {$lte: value};
    }
    return {$eq: value};
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.actions.emit();
  }

  openMobileDialog(element: any): void {
    this.dialog.open(FullTableDialogComponent, {data: {element, columnList: this.columnList, actions: this.actions}});
  }

  clickedAction(element: any): void {
    this.actions.emit({type: 'click', element});
  }

  applyFilter(): void {
    if (this.filterForm.valid) {
      /*if (moment.isMoment(this.filterForm.value.value)) {
        this.filterForm.controls.value.setValue(moment(this.filterForm.value.value).format('MM/DD/YYYY'));
      }*/
      this.chipList.push(this.filterForm.value);
      this.actions.emit();
    }
    this.filterForm.reset();
  }

  removeChip(chip: {column: string, operation: string, value: any}): void {
    const index = this.chipList.findIndex(c => _.isEqual(c, chip));
    if (index >= 0) {
      this.chipList.splice(index, 1);
    }
    this.actions.emit();
  }

  getFilterColumnType(): string | null {
    const columnControl = this.filterForm.get('column');
    if (columnControl) {
      const col = columnControl.value;
      if (col) {
        const cl = this.columnList.find(c => c.name === col);
        // if is is specified
        if (cl && cl.type) {
          return cl.type;
        }
        // string is default
        return 'string';

        // if it is not specified try to check (i hope never)
        /*if (this.elementList[0][cl.def]) {
          if (Date.parse(this.elementList[0][cl.def])) {
            return 'date';
          }
          return typeof this.elementList[0][cl.def];
        }*/
      }
    }
    return null;
  }

  getFilterDefault(): {title: string, value: string}[] {
    const columnControl = this.filterForm.get('column');
    if (columnControl) {
      const col = columnControl.value;
      if (col) {
        const cl = this.columnList.find(c => c.name === col);
        if (cl && cl.filterDefault) {
          return cl.filterDefault;
        }
      }
    }
    return [];
  }
}

