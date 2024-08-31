import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetEvolutionComponent } from './projet-evolution.component';

describe('ProjetEvolutionComponent', () => {
  let component: ProjetEvolutionComponent;
  let fixture: ComponentFixture<ProjetEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetEvolutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
