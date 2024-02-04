import {CustomError} from "./customError";

/**
 * The server cannot or will not process the request due to something that is perceived to be a client error
 * (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
 *
 * HTTP status code: 400
 */
class BadRequestError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Bad Request") {
        super(message, 400, additionalInfo);
    }
}

/**
 * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
 * That is, the client must authenticate itself to get the requested response.
 *
 * HTTP status code: 401
 */
class UnauthorizedError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Unauthorized") {
        super(message, 401, additionalInfo);
    }
}

/**
 * The client does not have access rights to the content; that is, it is unauthorized,
 * so the server is refusing to give the requested resource.
 * Unlike 401 Unauthorized, the client's identity is known to the server.
 *
 * HTTP status code: 403
 */
class ForbiddenError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Forbidden") {
        super(message, 403, additionalInfo);
    }
}

/**
 * The server cannot find the requested resource. In the browser, this means the URL is not recognized.
 * In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
 * Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client.
 * This response code is probably the most well known due to its frequent occurrence on the web.
 *
 * HTTP status code: 404
 */
class NotFoundError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Not Found") {
        super(message, 404, additionalInfo);
    }
}

/**
 * This response is sent when a request conflicts with the current state of the server.
 *
 * HTTP status code: 409
 */
class ConflictError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Conflict") {
        super(message, 409, additionalInfo);
    }
}

export {  BadRequestError
    , UnauthorizedError
    , ForbiddenError
    , NotFoundError
    , ConflictError
};