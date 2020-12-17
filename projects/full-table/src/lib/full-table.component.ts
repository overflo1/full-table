import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'lib-full-table',
  template: `
    <mat-toolbar class="filter-toolbar" *ngIf="elementList?.length || chipList?.length">
      <button #menuTrigger="matMenuTrigger" [mat-menu-trigger-for]="filterMenu" mat-icon-button>
        <mat-icon>{{filterForm.valid ? 'done' : 'search'}}</mat-icon>
      </button>
      <mat-menu #filterMenu="matMenu" (close)="applyFilter()" [overlapTrigger]="false">
        <form (click)="$event.stopPropagation()" (keydown.enter)="applyFilter()" (keydown.tab)="$event.stopPropagation()"
              [formGroup]="filterForm" class="form-menu">

          <!--column-->
          <mat-form-field [style.width.%]="100">
            <mat-label>Seleziona Colonna</mat-label>
            <input [matAutocomplete]="columnAuto" autocomplete="off" formControlName="column" matInput required>
            <mat-autocomplete #columnAuto="matAutocomplete" autoActiveFirstOption>
              <mat-option *ngFor="let column of filteredColumnsForm$ | async" [value]="column.name">
                {{column.name}}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <!--operation-->
          <br *ngIf="getFilterColumnType() == 'number' || getFilterColumnType() == 'date'">
          <mat-form-field *ngIf="getFilterColumnType() == 'number' || getFilterColumnType() == 'date'"
                          [style.width.%]="100">
            <mat-label>Seleziona Operazione</mat-label>
            <mat-select formControlName="operation" required>
              <mat-option [value]="'='">=</mat-option>
              <mat-option [value]="'!='">!=</mat-option>
              <mat-option [value]="'>'">></mat-option>
              <mat-option [value]="'>='">>=</mat-option>
              <mat-option [value]="'<'"><</mat-option>
              <mat-option [value]="'<='"><=</mat-option>
            </mat-select>
          </mat-form-field>


          <!--value-->
          <br *ngIf="filterForm.controls.column.value">
          <mat-form-field
            *ngIf="getFilterColumnType() == 'string'  || getFilterColumnType() == 'number' || getFilterColumnType() == 'date'"
            [style.width.%]="100">
            <mat-label>Seleziona Valore</mat-label>

            <!--string or number-->
            <input [matAutocomplete]="filterDefault" *ngIf="getFilterColumnType() == 'string'  || getFilterColumnType() == 'number'"
                   [type]="getFilterColumnType() == 'string' ? 'text' : 'number'" autocomplete="off" formControlName="value"
                   matInput>
            <!--filter default-->
            <mat-autocomplete #filterDefault="matAutocomplete" autoActiveFirstOption>
              <mat-option *ngFor="let option of getFilterDefault()" [value]="option.value">
                {{option.title}}
              </mat-option>
            </mat-autocomplete>

            <!--date-->
            <input *ngIf="getFilterColumnType() == 'date'" [matDatepicker]="picker"
                   formControlName="value" matInput>
            <mat-datepicker-toggle *ngIf="getFilterColumnType() == 'date'" [for]="picker" matSuffix></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <!--boolean-->
          <mat-slide-toggle *ngIf="getFilterColumnType() == 'boolean'" formControlName="value"></mat-slide-toggle>

        </form>
      </mat-menu>


      <mat-chip-list aria-label="Fish selection">
        <mat-chip (removed)="removeChip(chip)" *ngFor="let chip of chipList">
          {{chip.column}} {{chip.operation ? chip.operation : '='}} {{chip.value === null || chip.value === '' ? 'NULL' : chip.value}}
          <mat-icon matChipRemove>cancel</mat-icon>
        </mat-chip>
      </mat-chip-list>

    </mat-toolbar>


    <mat-progress-bar *ngIf="loading" color="accent" mode="query"></mat-progress-bar>

    <mat-table [dataSource]="elementList" fxHide.lt-md matSort>
      <ng-container *ngFor="let column of columnList" [matColumnDef]="column.def">
        <mat-header-cell *matHeaderCellDef [disabled]="!column.sort" mat-sort-header>{{column.name}}</mat-header-cell>
        <span *ngIf="column.def !== 'actions'">
      <mat-cell (click)="clickedAction(element)" *matCellDef="let element">{{column.value(element)}}</mat-cell>
    </span>
        <span *ngIf="column.def === 'actions'">
      <mat-cell *matCellDef="let element">
        <span *ngIf="column.value.length == 1 else moreMenu">
          <span *ngFor="let action of column.value">
           <button (click)="actions.emit({type: action.type, element: element })"
                   *ngIf="action.filter ? action.filter(element) : true"
                   [matTooltip]="action.type" mat-icon-button>
             <mat-icon>{{action.icon ? action.icon : action.type}}</mat-icon>
           </button>
        </span>
        </span>
        <ng-template #moreMenu>
          <button [matMenuTriggerFor]="entityMenu" mat-icon-button><mat-icon>more_vert</mat-icon></button>
        <mat-menu #entityMenu="matMenu">
          <span *ngFor="let action of column.value">
           <button (click)="actions.emit({type: action.type, element: element })"
                   *ngIf="action.filter ? action.filter(element) : true"
                   [matTooltip]="action.type" mat-icon-button>
             <mat-icon>{{action.icon ? action.icon : action.type}}</mat-icon>
           </button>
        </span>
        </mat-menu>
        </ng-template>
      </mat-cell>
    </span>
      </ng-container>
      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns; let i = index; let odd = odd; " [class.odd]="odd"></mat-row>
    </mat-table>


    <mat-table [dataSource]="elementList" fxHide.gt-sm>
      <ng-container matColumnDef="mobile">
        <mat-cell (click)="openMobileDialog(element)" *matCellDef="let element">{{columnMobile.value(element)}}</mat-cell>
      </ng-container>
      <mat-row *matRowDef="let row; columns: ['mobile']; let i = index; let odd = odd; " [class.odd]="odd"></mat-row>
    </mat-table>


    <mat-paginator [fxHide]="elementList && elementList.length == 0" [length]="elementLenght"
                   [pageSizeOptions]="[5, 10, 25, 50, 100]" [pageSize]="pageSize"></mat-paginator>

    <div *ngIf="elementList && elementList.length == 0" class="empty-message">
      <mat-icon>warning</mat-icon>
      Lista vuota
    </div>
  `,
  styleUrls: [
    './full-table.component.scss'
  ]
})
export class FullTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() path: string;
  @Input() columnList: any;
  /*    {
      def: string, name: string, value: string |
        { type: string, icon: string, filter: (element) => boolean }[] |
        ((element) => string), sort?: boolean
    }[];*/
  @Input() columnMobile?: any;
  @Input() actions?: EventEmitter<void | { type: string, element: any }>;
  @Input() search?: SCondition;
  @Input() join?;
  @Input() defaultSort?: QuerySort;
  @Input() pageSize?;
  @Output() data = new EventEmitter<any[]>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  elementList: any[];
  displayedColumns: string[];
  elementLenght: number;
  loading = true;

  isMobileLayout = window.innerWidth < 600;

  filterForm = this.fb.group({
    column: [''],
    operation: ['='],
    value: [''],
  });
  filteredColumnsForm$: Observable<any>;
  chipList = [];
  @ViewChild(MatMenuTrigger, {static: false}) trigger: MatMenuTrigger;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileLayout = event.target.innerWidth < 600;
  }

  ngOnInit() {
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
    this.filteredColumnsForm$ = this.filterForm.get('column').valueChanges.pipe(
      startWith(''),
      map(value =>
        this.columnList.filter(col => col.name.toLowerCase().includes(value ? value.toLowerCase() : '') && col.def !== 'actions')
      )
    );
    this.displayedColumns = this.columnList.map(x => x.def);
    this.paginator._intl.firstPageLabel = 'prima pagina';
    this.paginator._intl.itemsPerPageLabel = 'elementi per pagina';
    this.paginator._intl.lastPageLabel = 'ultima pagina';
    this.paginator._intl.nextPageLabel = 'pagina successiva';
    this.paginator._intl.previousPageLabel = 'pagina precedente';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) =>
      `${page * pageSize + 1} - ${page * pageSize + pageSize > length ? length : page * pageSize + pageSize} di ${length}`;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.actions)
      .pipe(
        filter((a: Sort | PageEvent | undefined | { type: string, element: any }) => {
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
      ).subscribe(data => this.elementList = data);
    this.filterForm.get('column').valueChanges.subscribe(col => {
      // for boolean init false
      if (this.getFilterColumnType() === 'boolean' && !this.filterForm.get('value').value) {
        this.filterForm.get('value').setValue(false);
      }
    });
  }

  getData(sort: string, order: string, limit: number, page: number, search: SCondition): Observable<any> {
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
      let s = {};
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
      `${environment.BASE_PATH}/${this.path}?${qb.query()}`;
    return this.http.get(requestUrl);
  }

  getSearchOperation(op: string, value: any) {
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

  openMobileDialog(element: any) {
    this.dialog.open(FullTableDialogComponent, {data: {element, columnList: this.columnList, actions: this.actions}});
  }

  clickedAction(element: any) {
    this.actions.emit({type: 'click', element});
  }

  applyFilter() {
    if (this.filterForm.valid) {
      /*if (moment.isMoment(this.filterForm.value.value)) {
        this.filterForm.controls.value.setValue(moment(this.filterForm.value.value).format('MM/DD/YYYY'));
      }*/
      this.chipList.push(this.filterForm.value);
      this.actions.emit();
    }
    this.filterForm.reset();
  }

  removeChip(chip) {
    const index = this.chipList.findIndex(c => _.isEqual(c, chip));
    if (index >= 0) {
      this.chipList.splice(index, 1);
    }
    this.actions.emit();
  }

  getFilterColumnType(): string {
    const col = this.filterForm.get('column').value;
    if (col) {
      const cl = this.columnList.find(c => c.name === col);
      // if is is specified
      if (cl && cl.type) {
        return cl.type;
      }
      // string is default
      return 'string';

      // if it is not specified try to check (i hope never)
      if (this.elementList[0][cl.def]) {
        /*if (Date.parse(this.elementList[0][cl.def])) {
          return 'date';
        }*/
        return typeof this.elementList[0][cl.def];
      }
    }
    return null;
  }

  getFilterDefault() {
    const col = this.filterForm.get('column').value;
    if (col) {
      const cl = this.columnList.find(c => c.name === col);
      if (cl && cl.filterDefault) {
        return cl.filterDefault;
      }
      return [];
    }
  }
}

