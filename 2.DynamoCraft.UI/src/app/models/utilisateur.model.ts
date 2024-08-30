import { ImageUtilisateur } from "./imageUtilisateur.model";
import { Projet } from "./projet.model";

export class Utilisateur {
    id?: number;
    pseudo?: string;
    email: string;
    password: string;
    dateNaissance?: Date;
    biographie?: string;
    centreInterets?: string;
    statutCompte?: boolean;
    roleId?: number;
    dateInscription?: Date;
    dateModif?: Date;
    imageUtilisateur?: ImageUtilisateur;
    totalLikes?: number;
    totalDownloads?: number;
    totalCommentaires?: number;
    projet?: Projet[];
    totalProjetsCrees?: number;
    totalUploads? : number;
    totalLikesGiven?: number;
    totalComments?: number;

    constructor(
        email: string,
        password: string,
        pseudo?: string,
        dateNaissance?: Date,
        biographie?: string,
        centreInterets?: string,
        statutCompte?: boolean,
        roleId?: number,
        dateInscription: Date = new Date(),
        dateModif: Date = new Date(),
        id?: number,
        imageUtilisateur?: ImageUtilisateur,
        totalLikes?: number,
        totalDownloads?: number,
        totalCommentaires?: number,
        projets?: Projet[],
        totalProjetsCrees?: number,
        totalLikeGiven?: number,
        totalUploads? : number,
        totalComments? : number,

    ) {
        this.pseudo = pseudo;
        this.email = email;
        this.dateNaissance = dateNaissance;
        this.biographie = biographie;
        this.password = password;
        this.centreInterets = centreInterets;
        this.statutCompte = statutCompte;
        this.roleId = roleId;
        this.dateInscription = dateInscription;
        this.dateModif = dateModif;
        this.id = id;
        this.imageUtilisateur = imageUtilisateur;
        this.totalLikes = totalLikes;
        this.totalDownloads = totalDownloads;
        this.totalCommentaires = totalCommentaires,
        this.totalUploads = totalUploads;
        this.projet = projets;
        this.totalProjetsCrees = totalProjetsCrees;
        this.totalLikesGiven = totalLikeGiven;
        this.totalComments = totalComments;
    }
}
