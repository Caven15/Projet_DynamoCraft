export class Role {
    id: number;
    nom: string;

    constructor(
        id: number,
        nom: string,
    ) {
        this.nom = nom;
        this.id = id;
    }
}
