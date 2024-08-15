import { ImageProjet } from "./imageProjet.model";

export class Projet {
    nom: string;
    description: string;
    estvalide: boolean;
    commentaire_admin: string;
    statutId: number;
    statistiqueId?: number;
    categorieId: number;
    utilisateurId: number;
    id?: number;
    ImageProjet?: ImageProjet[];

    constructor(
        nom: string,
        description: string,
        estvalide: boolean = false,
        commentaire_admin: string = "En attente de validation.",
        statutId: number,
        categorieId: number,
        utilisateurId: number,
        id?: number,
        ImageProjet: ImageProjet[] = [],
        statistiqueId?: number
    ) {
        this.nom = nom;
        this.description = description;
        this.estvalide = estvalide;
        this.commentaire_admin = commentaire_admin;
        this.statutId = statutId;
        this.statistiqueId = statistiqueId;
        this.categorieId = categorieId;
        this.utilisateurId = utilisateurId;
        this.ImageProjet = ImageProjet;
        this.id = id;
    }
}