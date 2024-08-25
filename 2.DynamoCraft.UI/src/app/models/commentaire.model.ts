import { Utilisateur } from "./utilisateur.model";

export class Commentaire {
    id?: number;
    description: string;
    dateCreation?: Date;
    dateModif?: Date;
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
        utilisateur: Utilisateur
    ) {
        this.id = id;
        this.description = description;
        this.dateCreation = dateCreation;
        this.dateModif = dateModif;
        this.projetId = projetId;
        this.utilisateurId = utilisateurId;
        this.utilisateur = utilisateur;
    }
}
