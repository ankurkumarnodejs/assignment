import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateaccountComponent } from './activateaccount.component';

describe('ActivateaccountComponent', () => {
  let component: ActivateaccountComponent;
  let fixture: ComponentFixture<ActivateaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
