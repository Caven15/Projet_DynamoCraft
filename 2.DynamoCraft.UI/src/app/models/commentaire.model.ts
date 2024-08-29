import { Projet } from "./projet.model";
import { Utilisateur } from "./utilisateur.model";

export class Commentaire {
    id?: number;
    description: string;
    dateCreation?: Date;
    dateModif?: Date;
    projet?: Projet;
    projetId: number;
    utilisateurId?: number;
    utilisateur? : Utilisateur;

    constructor(
        id: number,
        description: string,
        dateCreation: Date,
        dateModif: Date,
        projetId: number,
        utilisateurId: number,
        utilisateur: Utilisateur,
        projet: Projet
    ) {
        this.id = id;
        this.description = description;
        this.dateCreation = dateCreation;
        this.dateModif = dateModif;
        this.projetId = projetId;
        this.utilisateurId = utilisateurId;
        this.utilisateur = utilisateur;
        this.projet = projet;
    }
}
