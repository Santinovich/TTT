/**
 * Clase de error personalizada que se envía en las respuestas de error para evitar 
 * enviar datos sensibles.
 */
export class TTTError extends Error {
    constructor(message: string, public statusCode: number = 400) {
        super(message);
        this.name = "TTTError";
    }
}
