import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailValidationComponent } from './detail-validation.component';

describe('DetailValidationComponent', () => {
  let component: DetailValidationComponent;
  let fixture: ComponentFixture<DetailValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
