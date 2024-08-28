import { TestBed } from '@angular/core/testing';

import { UtilisateurProjetLikeService } from './utilisateur-projet-like.service';

describe('UtilisateurProjetLikeService', () => {
  let service: UtilisateurProjetLikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilisateurProjetLikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
