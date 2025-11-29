import status from 'http-status';
import { TErrorSources, TGenericErrorResponse } from '../types/error.type';

const handleJWTError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: 'token',
      message: 'Invalid token. Please log in again.',
    },
  ];

  return {
    statusCode: status.UNAUTHORIZED,
    message: 'Authentication Failed',
    errorSources,
  };
};

const handleJWTExpiredError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: 'token',
      message: 'Your session has expired. Please log in again.',
    },
  ];

  return {
    statusCode: status.UNAUTHORIZED,
    message: 'Authentication Failed',
    errorSources,
  };
};

export { handleJWTError, handleJWTExpiredError };
