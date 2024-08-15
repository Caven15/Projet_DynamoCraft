export class ImageProjet {
    id: number;
    nom: string;
    dateCreation: Date;
    dateModif: Date;
    projetId: number;

    constructor(
        nom: string,
        dateCreation: Date = new Date(),
        dateModif: Date = new Date(),
        projetId: number,
        id: number
    ) {
        this.nom = nom;
        this.dateCreation = dateCreation;
        this.dateModif = dateModif;
        this.projetId = projetId;
        this.id = id;
    }
}