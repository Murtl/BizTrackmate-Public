import {CustomError} from "./customError";

/**
 * The server has encountered a situation it does not know how to handle.
 *
 * HTTP status code: 500
 */
class InternalServerError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Internal Server Error") {
        super(message, 500, additionalInfo);
    }
}

/**
 * The request method is not supported by the server and cannot be handled.
 * The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
 *
 * HTTP status code: 501
 */
class NotImplementedError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Not Implemented") {
        super(message, 501, additionalInfo);
    }
}

/**
 * This error response means that the server, while working as a gateway to get a response needed to handle the request,
 * got an invalid response.
 *
 * HTTP status code: 502
 */
class BadGatewayError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Bad Gateway") {
        super(message, 502, additionalInfo);
    }
}

/**
 * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
 * Note that together with this response, a user-friendly page explaining the problem should be sent.
 * This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated
 * time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along
 * with this response, as these temporary condition responses should usually not be cached.
 *
 * HTTP status code: 503
 */
class ServiceUnavailableError extends CustomError {
    constructor( additionalInfo: any = {}, message: string = "Service Unavailable") {
        super(message, 503, additionalInfo);
    }
}

export {
    InternalServerError,
    NotImplementedError,
    BadGatewayError,
    ServiceUnavailableError
}