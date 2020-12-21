import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ColumnListModel} from '../model/column-list.model';

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
}

interface DialogData {
  element: any;
  columnList: ColumnListModel[];
  actions: any;
}
