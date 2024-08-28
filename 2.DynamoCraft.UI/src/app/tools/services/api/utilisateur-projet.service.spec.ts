import { TestBed } from '@angular/core/testing';

import { UtilisateurProjetService } from './utilisateur-projet.service';

describe('UtilisateurProjetService', () => {
  let service: UtilisateurProjetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilisateurProjetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
