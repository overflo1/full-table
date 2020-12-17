import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-full-table-dialog',
  templateUrl: './full-table-dialog.component.html',
  styleUrls: ['./full-table-dialog.component.scss']
})
export class FullTableDialogComponent implements OnInit {

  cols = [];

  constructor(
    public dialogRef: MatDialogRef<FullTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { element: any, columnList: any, actions: any },
  ) {
    this.cols = this.data.columnList.map(x => x.def);
  }

  ngOnInit() {
    this.dialogRef.updateSize('400px');
  }
}
