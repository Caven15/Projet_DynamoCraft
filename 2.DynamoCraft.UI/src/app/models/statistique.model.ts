export class Statistique {
    id?: number;
    nombreApreciation: number;
    nombreTelechargement: number;
    datePublication: Date;
    dateModification: Date;

    constructor(
        nombreApreciation: number,
        nombreTelechargement: number,
        datePublication: Date = new Date(),
        dateModification: Date = new Date(),
        id?: number
    ) {
        this.nombreApreciation = nombreApreciation;
        this.nombreTelechargement = nombreTelechargement;
        this.datePublication = datePublication;
        this.dateModification = dateModification;
        this.id = id;
    }
}
