# Unified Server Kit (Express-Server-Starter)

A robust, production-ready Express.js starter template with TypeScript, MongoDB, and essential security features.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Technologies](#technologies)
- [Error Handling System](#error-handling-system)
  - [Purpose](#purpose)
  - [Required Dependencies](#required-dependencies)
  - [Error Types](#error-types)
  - [Custom Error Class](#custom-error-class)
  - [Error Handlers](#error-handlers)
  - [Utility Functions](#utility-functions)
  - [Response Format](#error-response-format)
  - [Testing Errors](#testing-errors)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

```bash
# Clone the repository
git clone -b <branch-name> <your-repo-url>
ex: git clone -b unified-server-kit https://github.com/CodeSperk/express-server-starter.git

cd unified-server-kit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm start
```

## Features

### Implemented

- **Express.js with TypeScript**
- **MongoDB with Mongoose ODM**
- **CORS Enabled**
- **Environment Configuration**
- **HTTP Status Codes**
- **Global Error Handling**
- **Input Validation**
- **Async Handler Wrapper**
- **File Upload Error Handling**

### Planned Features

- JWT Authentication
- Role-based Access Control (RBAC)
- Rate Limiting
- Security Headers (Helmet)
- File/Image Upload Implementation
- Logging System
- API Documentation (Swagger)

## Technologies

| Category           | Technology                  |
| ------------------ | --------------------------- |
| **Runtime**        | Node.js                     |
| **Framework**      | Express.js with TypeScript  |
| **Database**       | MongoDB with Mongoose       |
| **Validation**     | Zod                         |
| **Security**       | CORS, Environment Variables |
| **File Handling**  | Multer                      |
| **Error Handling** | Custom AppError System      |

---

## Error Handling System

### Purpose

- Provide consistent error responses to clients
- Differentiate between operational and program errors
- Enable proper error logging and monitoring
- Handle various error types (Zod, Mongoose, JWT, Multer)

### Required Dependencies

```json
{
  "dependencies": {
    "http-status": "^2.1.0",
    "zod": "^4.1.13",
    "multer": "^2.0.2"
  }
}
```

### Error Types

**File:** `src/app/types/error.type.ts`

```typescript
export type TErrorSource = {
  path: string;
  message: string;
};

export type TErrorSources = TErrorSource[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
```

### Custom Error Class

**File:** `src/app/errors/appError.ts`

```typescript
import { TErrorSources } from "../types/error.type";

class AppError extends Error {
  public statusCode: number;
  public errors: TErrorSources | null;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: TErrorSources | null = null,
    isOperational: boolean = true,
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
```

**Usage Example:**

```typescript
import AppError from "./errors/appError";
import status from "http-status";

// Throw operational error
throw new AppError(status.NOT_FOUND, "User not found");

// Throw with detailed errors
throw new AppError(status.BAD_REQUEST, "Validation failed", [
  { path: "email", message: "Invalid email format" },
]);
```

### error-handlers

#### Zod Validation Error Handler

**File:** `src/app/errors/zodError.ts`

```typescript
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
```

#### Mongoose Error Handlers

**File:** `src/app/errors/mongooseError.ts`

```typescript
import status from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../types/error.type";

const handleMongooseValidationError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: any) => ({
      path: val.path,
      message: val.message,
    })
  );

  return {
    statusCode: status.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};

const handleMongooseCastError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: `The value "${err.value}" is not a valid MongoDB ObjectId.`,
    },
  ];

  return {
    statusCode: status.BAD_REQUEST,
    message: "Invalid ID Format",
    errorSources,
  };
};

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
    message: "Duplicate Key Error",
    errorSources,
  };
};

export {
  handleMongooseValidationError,
  handleMongooseCastError,
  handleMongooseDuplicateKeyError,
};
```

#### JWT Error Handlers

**File:** `src/app/errors/jwtError.ts`

```typescript
import status from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../types/error.type";

const handleJWTError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: "token",
      message: "Invalid token. Please log in again.",
    },
  ];

  return {
    statusCode: status.UNAUTHORIZED,
    message: "Authentication Failed",
    errorSources,
  };
};

const handleJWTExpiredError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: "token",
      message: "Your session has expired. Please log in again.",
    },
  ];

  return {
    statusCode: status.UNAUTHORIZED,
    message: "Authentication Failed",
    errorSources,
  };
};

export { handleJWTError, handleJWTExpiredError };
```

#### Global Error Handler

**File:** `src/app/middlewares/globalErrorHandler.ts`

```typescript
import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import status from "http-status";
import config from "../config";
import handleZodError from "../errors/zodError";
import AppError from "../errors/appError";
import {
  handleMongooseValidationError,
  handleMongooseCastError,
  handleMongooseDuplicateKeyError,
} from "../errors/mongooseError";
import { handleJWTError, handleJWTExpiredError } from "../errors/jwtError";
import { TErrorSource } from "../types/error.type";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errors: TErrorSource[] = [];

  const isOperational = err instanceof AppError ? err.isOperational : false;

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "ValidationError") {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.code === 11000) {
    const simplifiedError = handleMongooseDuplicateKeyError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "CastError") {
    const simplifiedError = handleMongooseCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "JsonWebTokenError") {
    const simplifiedError = handleJWTError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err.name === "TokenExpiredError") {
    const simplifiedError = handleJWTExpiredError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [{ path: "", message: err.message }];
  } else if (err instanceof MulterError) {
    statusCode = status.BAD_REQUEST;

    const multerErrorMessages: Record<string, string> = {
      LIMIT_FILE_SIZE: "File size exceeds the allowed limit",
      LIMIT_FILE_COUNT: "Too many files uploaded",
      LIMIT_UNEXPECTED_FILE: "Unexpected field name",
      LIMIT_PART_COUNT: "Too many form parts",
      LIMIT_FIELD_KEY: "Field name too long",
      LIMIT_FIELD_VALUE: "Field value too long",
      LIMIT_FIELD_COUNT: "Too many fields",
    };

    message = multerErrorMessages[err.code] || "File upload error";
    errors = [
      {
        path: err.field || "file",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    errors = [{ path: "", message: err.message }];
  } else {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
    errors = [{ path: "unknown", message: "An unexpected error occurred" }];
  }

  if (config.node_env === "production") {
    const noisyPaths = [
      "/.well-known/appspecific/com.chrome.devtools.json",
      "/favicon.ico",
      "/robots.txt",
    ];

    if (!noisyPaths.includes(req.path)) {
      if (isOperational) {
        console.log("Operational Error:", {
          statusCode,
          path: req.path,
          message: err.message,
        });
      } else {
        console.error("Program Error:", {
          statusCode,
          path: req.path,
          message: err.message,
          stack: err.stack,
        });
      }
    }
  }

  const response: any = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  if (config.node_env === "development") {
    response.stack = err?.stack;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
```

### Utility Functions

**File:** `src/app/errors/index.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import status from "http-status";
import AppError from "./appError";

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(
    status.NOT_FOUND,
    `Route not found - ${req.method} ${req.originalUrl}`
  );
  next(error);
};

const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export { AppError, notFound, asyncHandler };
```

**Usage in Routes:**

```typescript
import { asyncHandler } from "./errors";

// Wrap async route handlers
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json({ success: true, data: users });
  })
);
```

### Error Response Format

#### Development Mode

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "stack": "Error: Validation Error\n    at ..."
}
```

#### Production Mode

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Testing Errors

**File:** `src/app/routes/test.routes.ts`

```typescript
import { Request, Response, Router } from "express";
import { z } from "zod";
import { AppError, asyncHandler } from "../errors";

const router = Router();

const testSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(18, "Must be at least 18 years old"),
});

router.get("/operational-error", (_req: Request, _res: Response) => {
  throw new AppError(400, "This is an operational error", [
    { path: "email", message: "Email is invalid" },
    { path: "password", message: "Password must be at least 6 characters" },
  ]);
});

router.get("/non-operational-error", (_req: Request, _res: Response) => {
  throw new AppError(500, "This is a non-operational error", null, false);
});

router.get("/programming-error", (_req: Request, _res: Response) => {
  throw new Error("This is a programming error");
});

router.post("/zod-validation", (req: Request, res: Response) => {
  const result = testSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }
  res.json({ success: true, data: result.data });
});

router.get("/multi-field-error", (_req: Request, _res: Response) => {
  throw new AppError(422, "Multiple validation errors", [
    { path: "email", message: "Email is required" },
    { path: "password", message: "Password must be at least 6 characters" },
    { path: "username", message: "Username must be unique" },
  ]);
});

router.get(
  "/async-error",
  asyncHandler(async (_req: Request, _res: Response) => {
    throw new AppError(400, "Async operation failed");
  })
);

router.get("/simple-error", (_req: Request, _res: Response) => {
  throw new AppError(401, "You are not authorized");
});

router.get("/generic-error", (_req: Request, _res: Response) => {
  throw new Error("This is a generic error");
});

router.get("/success", (_req: Request, res) => {
  res.json({
    success: true,
    message: "Test route is working perfectly!",
    timestamp: new Date().toISOString(),
  });
});

export const testRoutes = router;
```

**File:** `src/app.ts`

```typescript
//add after app.get() function

app.use("/api/test", testRoutes);
//reaming codes
```

All test routes are available under `/test` endpoint:

```bash
# Test successful route
curl http://localhost:5000/test/success

# Test operational error with multiple fields
curl http://localhost:5000/test/operational-error

# Test non-operational error
curl http://localhost:5000/test/non-operational-error

# Test programming error
curl http://localhost:5000/test/programming-error

# Test Zod validation with invalid data
curl -X POST http://localhost:5000/test/zod-validation \
  -H "Content-Type: application/json" \
  -d '{"name": "A", "email": "invalid", "age": 16}'

# Test multiple field validation errors
curl http://localhost:5000/test/multi-field-error

# Test async error handling
curl http://localhost:5000/test/async-error

# Test simple authorization error
curl http://localhost:5000/test/simple-error

# Test generic error
curl http://localhost:5000/test/generic-error

# Test 404 handling for non-existent routes
curl http://localhost:5000/non-existent-route
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, please open an issue on GitHub.
Contact me at : inbx.mahbub@gmail.com

---

<div align="center">
Made with ❤️ by MAHBUBUR RAHMAN
</div>
