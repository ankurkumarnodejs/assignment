import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedDatingComponent } from './speed-dating.component';

describe('SpeedDatingComponent', () => {
  let component: SpeedDatingComponent;
  let fixture: ComponentFixture<SpeedDatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedDatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedDatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
