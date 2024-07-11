export class Commentaire {
    id: number;
    description: string;
    dateCreation: Date;
    dateModif: Date;
    projetId: number;
    utilisateurId: number;

    constructor(
        id: number,
        description: string,
        dateCreation: Date,
        dateModif: Date,
        projetId: number,
        utilisateurId: number
    ) {
        this.id = id;
        this.description = description;
        this.dateCreation = dateCreation;
        this.dateModif = dateModif;
        this.projetId = projetId;
        this.utilisateurId = utilisateurId;
    }
}
