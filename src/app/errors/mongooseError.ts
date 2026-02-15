import status from 'http-status';
import { TErrorSources, TGenericErrorResponse } from '../types/error.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseValidationError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (val: any) => ({
      path: val.path,
      message: val.message,
    }),
  );

  return {
    statusCode: status.BAD_REQUEST,
    message: 'Validation Error',
    errorSources,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseCastError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: `The value "${err.value}" is not a valid MongoDB ObjectId.`,
    },
  ];

  return {
    statusCode: status.BAD_REQUEST,
    message: 'Invalid ID Format',
    errorSources,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseDuplicateKeyError = (err: any): TGenericErrorResponse => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const errorSources: TErrorSources = [
    {
      path: field,
      message: `The value "${value}" for field "${field}" is already in use.`,
    },
  ];

  return {
    statusCode: status.CONFLICT,
    message: 'Duplicate Key Error',
    errorSources,
  };
};

export { handleMongooseValidationError, handleMongooseCastError, handleMongooseDuplicateKeyError };
