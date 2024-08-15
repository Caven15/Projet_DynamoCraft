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
<<<<<<< HEAD
    ImageProjet?: ImageProjet[];
=======
    images?: ImageProjet[];
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb

    constructor(
        nom: string,
        description: string,
        estvalide: boolean = false,
        commentaire_admin: string = "En attente de validation.",
        statutId: number,
        categorieId: number,
        utilisateurId: number,
        id?: number,
<<<<<<< HEAD
        ImageProjet: ImageProjet[] = [],
=======
        images: ImageProjet[] = [],
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb
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
<<<<<<< HEAD
        this.ImageProjet = ImageProjet;
=======
        this.images = images;
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb
        this.id = id;
    }
}