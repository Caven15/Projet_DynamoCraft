import { ImageUtilisateur } from "./imageUtilisateur.model";

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
    ImageUtilisateur?: ImageUtilisateur;

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
        imageUtilisateur?: ImageUtilisateur
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
        this.ImageUtilisateur = imageUtilisateur;
    }
}
