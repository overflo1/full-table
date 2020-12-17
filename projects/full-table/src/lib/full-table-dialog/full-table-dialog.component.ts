import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ColumnListModel} from '../model/column-list.model';

@Component({
  selector: 'lib-full-table-dialog',
  template: `
    <mat-dialog-content class="mat-body">
      <ng-container *ngFor="let column of data.columnList">
        <p style="word-wrap: break-word">
          <b>{{column.name}}: </b>
          <span *ngIf="column.def !== 'actions'">{{column.value(data.element)}}</span>
          <span *ngIf="column.def === 'actions'">
        <span *ngFor="let action of column.value">
           <button (click)="data.actions.emit({type: action.type, element: data.element })"
                   *ngIf="action.filter ? action.filter(data.element) : true"
                   [matTooltip]="action.type"
                   mat-dialog-close mat-icon-button>
             <mat-icon>{{action.icon ? action.icon : action.type}}</mat-icon>
           </button>
        </span>
    </span>
        </p>
      </ng-container>
    </mat-dialog-content>
  `,
  styleUrls: ['./full-table-dialog.component.scss']
})
export class FullTableDialogComponent implements OnInit {

  cols: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<FullTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.cols = this.data.columnList.map(x => x.def);
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('400px');
  }
}

interface DialogData {
  element: any;
  columnList: ColumnListModel[];
  actions: any;
}
