import { ImageProjet } from "./imageProjet.model";
import { Statistique } from "./statistique.model";
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
    imageProjet?: ImageProjet[];
    utilisateur!: Utilisateur;
    statistique?: Statistique;
    nombreApreciation: number;
    nbTelechargements: number;

    constructor(
        nom: string,
        description: string,
        estvalide: boolean = false,
        commentaire_admin: string = "En attente de validation.",
        statutId: number,
        categorieId: number,
        utilisateurId: number,
        id: number,
        imageProjet: ImageProjet[] = [],
        utilisateur: Utilisateur,
        statistique: Statistique,
        statistiqueId?: number,
        nombreApreciation: number = 0,
        nbTelechargements: number = 0
    ) {
        this.nom = nom;
        this.description = description;
        this.estvalide = estvalide;
        this.commentaire_admin = commentaire_admin;
        this.statutId = statutId;
        this.statistiqueId = statistiqueId;
        this.categorieId = categorieId;
        this.utilisateurId = utilisateurId;
        this.imageProjet = imageProjet;
        this.utilisateur = utilisateur;
        this.statistique = statistique;
        this.id = id;
        this.nombreApreciation = nombreApreciation;
        this.nbTelechargements = nbTelechargements;
    }
}
