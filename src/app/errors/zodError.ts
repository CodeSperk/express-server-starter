import { ZodError } from "zod";
import status from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../types/error.type";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    const path =
      issue.path && issue.path.length > 0 ? issue.path.join(".") : "field";

    return {
      path,
      message: issue.message,
    };
  });

  return {
    statusCode: status.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
