import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetMotDePasseOublieComponent } from './reset-mot-de-passe-oublie.component';

describe('ResetMotDePasseOublieComponent', () => {
  let component: ResetMotDePasseOublieComponent;
  let fixture: ComponentFixture<ResetMotDePasseOublieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetMotDePasseOublieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetMotDePasseOublieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
