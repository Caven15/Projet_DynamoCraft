import { TestBed } from '@angular/core/testing';

import { Modele3dService } from './modele-3d.service';

describe('Modele3dService', () => {
  let service: Modele3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Modele3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
