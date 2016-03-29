import 'extend-error';

export const UnexpectedError = Error.extend('UnexpectedError', 500);
export const AppError = Error.extend('AppError', 500);
export const ClientError = Error.extend('ClientError', 400);

export const BadRequest = ClientError.extend('BadRequest', 400);
export const NotFound = ClientError.extend('NotFound', 404);
export const NoContent = ClientError.extend('NoContent', 204);
