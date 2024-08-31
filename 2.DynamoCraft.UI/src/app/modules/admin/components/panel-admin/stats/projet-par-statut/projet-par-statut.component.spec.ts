import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetParStatutComponent } from './projet-par-statut.component';

describe('ProjetParStatutComponent', () => {
  let component: ProjetParStatutComponent;
  let fixture: ComponentFixture<ProjetParStatutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetParStatutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetParStatutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
