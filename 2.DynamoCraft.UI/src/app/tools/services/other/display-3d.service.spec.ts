import { TestBed } from '@angular/core/testing';

import { Display3dService } from './display-3d.service';

describe('Display3dService', () => {
  let service: Display3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Display3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
