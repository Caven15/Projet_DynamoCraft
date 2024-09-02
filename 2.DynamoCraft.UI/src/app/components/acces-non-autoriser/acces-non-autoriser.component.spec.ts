import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesNonAutoriserComponent } from './acces-non-autoriser.component';

describe('AccesNonAutoriserComponent', () => {
  let component: AccesNonAutoriserComponent;
  let fixture: ComponentFixture<AccesNonAutoriserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccesNonAutoriserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccesNonAutoriserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
