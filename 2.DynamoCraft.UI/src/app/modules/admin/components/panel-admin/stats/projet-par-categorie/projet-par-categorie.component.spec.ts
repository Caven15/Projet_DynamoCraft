import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetParCategorieComponent } from './projet-par-categorie.component';

describe('ProjetParCategorieComponent', () => {
  let component: ProjetParCategorieComponent;
  let fixture: ComponentFixture<ProjetParCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetParCategorieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetParCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
