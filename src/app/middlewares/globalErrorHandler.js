import ApiError from '../../errors/ApiError.js';
import handleValidationError from '../../errors/handleValidationError.js';

import { z } from 'zod';
import handleCastError from '../../errors/handleCastError.js';
import handleZodError from '../../errors/handleZodError.js';

const globalErrorHandler = (
  error,
  req,
  res,
  // eslint-disable-next-line no-unused-vars
  next
) => {
  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages = [];
  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof z.ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.json({
    success: false,
    message,
    errorMessages,
    statusCode
  });
};

export default globalErrorHandler;