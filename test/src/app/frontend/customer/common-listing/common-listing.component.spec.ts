import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonListingComponent } from './common-listing.component';

describe('CommonListingComponent', () => {
  let component: CommonListingComponent;
  let fixture: ComponentFixture<CommonListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
