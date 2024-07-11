export class categorie {
    id?: number;
    nom: string;

    constructor(nom: string, id?: number) {
        this.nom = nom;
        this.id = id;
    }
}