import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableDialogComponent } from './disable-dialog.component';

describe('DisableDialogComponent', () => {
  let component: DisableDialogComponent;
  let fixture: ComponentFixture<DisableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
