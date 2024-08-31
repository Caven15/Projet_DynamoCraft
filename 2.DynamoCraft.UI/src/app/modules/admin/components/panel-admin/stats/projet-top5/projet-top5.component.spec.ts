import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetTop5Component } from './projet-top5.component';

describe('ProjetTop5Component', () => {
  let component: ProjetTop5Component;
  let fixture: ComponentFixture<ProjetTop5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjetTop5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetTop5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
