import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FullTableDialogComponent} from './details-dialog.component';

describe('DetailsDialogComponent', () => {
  let component: FullTableDialogComponent;
  let fixture: ComponentFixture<FullTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FullTableDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
