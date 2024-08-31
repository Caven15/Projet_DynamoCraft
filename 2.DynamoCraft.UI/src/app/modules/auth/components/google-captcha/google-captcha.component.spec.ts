import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCaptchaComponent } from './google-captcha.component';

describe('GoogleCaptchaComponent', () => {
  let component: GoogleCaptchaComponent;
  let fixture: ComponentFixture<GoogleCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleCaptchaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
