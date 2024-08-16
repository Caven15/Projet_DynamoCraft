import { ImageProjet } from "./imageProjet.model";
import { Utilisateur } from "./utilisateur.model";

export class Projet {
    nom: string;
    description: string;
    estvalide: boolean;
    commentaire_admin: string;
    statutId: number;
    statistiqueId?: number;
    categorieId: number;
    utilisateurId: number;
    id: number;
    ImageProjet?: ImageProjet[];
    Utilisateur!: Utilisateur;

    constructor(
        nom: string,
        description: string,
        estvalide: boolean = false,
        commentaire_admin: string = "En attente de validation.",
        statutId: number,
        categorieId: number,
        utilisateurId: number,
        id: number,
        ImageProjet: ImageProjet[] = [],
        utilisateur : Utilisateur,
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
        this.Utilisateur = utilisateur;
        this.id = id;
    }
}
