import {ModuleWithProviders, NgModule} from '@angular/core';
import { FullTableComponent } from './full-table/full-table.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {CommonModule} from '@angular/common';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {FullTableDialogComponent} from './full-table-dialog/full-table-dialog.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';

@NgModule({
    declarations: [FullTableComponent, FullTableDialogComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatProgressBarModule,
        MatTableModule,
        MatSortModule,
        MatTooltipModule,
        MatPaginatorModule,
        FlexLayoutModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    exports: [FullTableComponent]
})
export class FullTableModule {
  static forRoot(BASE_PATH?: string): ModuleWithProviders<FullTableModule> {
    return {
      ngModule: FullTableModule,
      providers: [{provide: 'BASE_PATH', useValue: BASE_PATH ? BASE_PATH : ''}]
    };
  }
}
