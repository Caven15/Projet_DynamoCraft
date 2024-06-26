export class ImageUtilisateur {
    id: number;
    nom: string;
    dateAjout: Date;
    dateModif: Date;
    utilisateurId: number;

    constructor(
        nom: string,
        dateAjout: Date,
        dateModif: Date,
        utilisateurId: number,
        id?: number
    ) {
        this.nom = nom;
        this.dateAjout = dateAjout;
        this.dateModif = dateModif;
        this.utilisateurId = utilisateurId;
        this.id = id || 0;
    }
}