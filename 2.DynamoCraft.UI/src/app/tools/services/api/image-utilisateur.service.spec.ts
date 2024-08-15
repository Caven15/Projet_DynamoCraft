import { TestBed } from '@angular/core/testing';

import { ImageUtilisateurService } from './image-utilisateur.service';

describe('ImageUtilisateurService', () => {
  let service: ImageUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
