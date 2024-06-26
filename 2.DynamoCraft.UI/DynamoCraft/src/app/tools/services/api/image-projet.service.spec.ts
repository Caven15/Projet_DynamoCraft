import { TestBed } from '@angular/core/testing';

import { ImageProjetService } from './image-projet.service';

describe('ImageProjetService', () => {
  let service: ImageProjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageProjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
