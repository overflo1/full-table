import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {ColumnModel} from '../model/column.model';

@Component({
  selector: 'lib-full-table-dialog',
  templateUrl: `./full-table-dialog.component.html`,
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

  getViewableColumnList(): ColumnModel[] {
    return this.data.columnList.filter(c => c.hidden === null || c.hidden === undefined || !c.hidden);
  }
}

interface DialogData {
  element: any;
  columnList: ColumnModel[];
  actions: any;
}
