export class Categorie {
    id?: number;
    nom: string;

    constructor(nom: string, id?: number) {
        this.nom = nom;
        this.id = id;
    }
}