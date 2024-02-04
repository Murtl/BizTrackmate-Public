/**
 * Oberklasse von diversen anderen spezifischen Errors (z.B. BadRequestError...).
 *
 * Kann benutzt werden, sollte noch kein anderer Error implementiert worden sein oder falls man nicht sicher ist welcher der Richtige ist,
 * denn es lässt sich der Status Code anpassen.
 */
export class CustomError {

    message!: string;
    status!: number;
    additionalInfo!: any;

    /**
     * @param message - Beschreibung des Errors
     * @param status - HTTP status code
     * @param additionalInfo - Zusätzliche Informationen z.B. für errors aus try / catch Blöcken geeignet.
     */
    constructor(message: string, status: number = 500, additionalInfo: any = {}) {
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo;
    }
}