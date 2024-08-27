import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPriveComponent } from './profil-prive.component';

describe('ProfilPriveComponent', () => {
  let component: ProfilPriveComponent;
  let fixture: ComponentFixture<ProfilPriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilPriveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilPriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
