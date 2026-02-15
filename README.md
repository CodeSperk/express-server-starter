# Unified Server Kit (Express Server Starter)

A production-ready Express.js starter kit built with **TypeScript**, **MongoDB**, and **Zod**, designed for clean architecture, strict validation, JWT-based authentication, **Role-Based Access Control (RBAC)**, and scalable backend development across local, production, Docker, CI, and serverless (Vercel) environments.

🔗 Live Preview: 
---

## Quick Start
```bash
# Clone the repository
git clone -b <branch-name> <your-repo-url>
ex: git clone -b unified-server-dynamic_rbac https://github.com/CodeSperk/express-server-starter.git
cd unified-server-dynamic_rbac

# Install dependencies
npm install

# Environment Variables
Create a `.env` file using `.env.example` as a reference.

# Start development server
npm run dev
```

## Features

### Included
#### Authentication & Security
- JWT Authentication
  - Access & Refresh tokens
  - Secure token verification
  - Password change invalidates old tokens
- Logout support (stateless, frontend-controlled)
- Forgot password & reset password flow
  - Secure, one-time reset tokens
  - Hashed tokens stored in database
  - Expiry enforced via centralized config
- Automatic Super Admin bootstrap (environment-based)
  - Creates initial Super Admin on first startup
  - Idempotent and safe across restarts and serverless cold starts
- Security Hardening
  - helmet for secure HTTP headers
  - express-rate-limit for abuse protection

#### Role-Based Access Control (RBAC)
A flexible and scalable RBAC system is implemented to control access at **resource-action level**.
- Access is controlled using:
  - Roles
  - Permissions (resource + action)
  - **Role ↔ Permission mapping`
- Example permissions:
      ```bash
      user:create
      rbac:manage
      bookings:read
    ```
##### Key Features
- System super_admin role (auto-created)
  - Cannot be modified or deleted
  - Automatically receives all permissions
  - Bypasses permission checks
- Permission-based route protection
- Prevents duplicate permission assignments
- Scalable for multi-module applications

##### Usage Example
```ts
router.post(
  '/create-role',
  authGuard,
  authorize('rbac', 'manage'),
  controller.createRole
);
```
### Available Auth Routes

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| POST   | `/rbac/create-role`        | Create role           |
| GET   | `/rbac/roles`           | Get roles        |
| PATCH   | `/rbac/roles/:roleId`         | Update role         |
| DELETE   | `/rbac/roles/:roleId`          | Soft delete role         |
| POST   | `/rbac/permissions` | Create permission    |
| GET   | `/rbac/permissions` | Get permissions   |
| POST   | `/rbac/assign`  | Assign permission to role          |
| POST   | `/rbac/remove`  | Remove permission from role           |


Permissions defined in ```rbac.config.ts``` are automatically synced and assigned to Super Admin during startup.

Example:
```ts
export const RBAC_PERMISSIONS = [
  { resource: 'rbac', action: 'manage' },
  { resource: 'user', action: 'create' },
];
```


#### Architecture & Validation
- Global Error Handling
  - Zod validation errors
  - Mongoose validation & duplicate key errors
  - JWT & Multer errors
  - Operational vs programming error separation
- Zod Validation
  - Request validation (body, params, query)
  - Environment variable validation
- Clean Architecture
  - Modular structure (auth, user, routes, middlewares)
  - Centralized AppError system
- Type Safety
  - TypeScript strict mode
  - Express request augmentation

- 
#### Developer Experience
- Async handler (no repetitive try/catch)
- ESLint & Prettier preconfigured
- Centralized config system (env.ts + config/index.ts)

#### Environment Ready
  - Local development
  - Production
  - Docker
  - CI pipelines
  - Serverless (Vercel)

### Roadmap / Planned
- Role-based Access Control (RBAC)
- File uploads
- Swagger / OpenAPI documentation
- Automated tests (unit & integration)
- Request ID & structured logging
- Email delivery integration (Nodemailer / SES / SendGrid)

## 🔐 Authentication Overview

### Available Auth Routes

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| POST   | `/auth/register`        | Register new user               |
| POST   | `/auth/login`           | Login & receive tokens          |
| POST   | `/auth/refresh`         | Refresh access token            |
| POST   | `/auth/logout`          | Logout user (stateless)         |
| POST   | `/auth/change-password` | Change password (protected)     |
| POST   | `/auth/forgot-password` | Request password reset          |
| POST   | `/auth/reset-password`  | Reset password reset            |

## Protected Route Example

```typescript
router.post(
  '/change-password',
  authGuard,
  validateRequest(schema),
  controller,
);
```

## Basic Usage Example

### Example Route
```typescript
router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: [] });
  }),
);
```

### Throwing an Error
```typescript
throw new AppError(404, 'User not found');
```

### Validation Example
```typescript
const schema = z.object({
  email: z.string().email(),
});

schema.parse(req.body);
```

## Tech Stack

| Category           | Technology                  |
| ------------------ | --------------------------- |
| **Runtime**        | Node.js                     |
| **Framework**      | Express.js + TypeScript  |
| **Database**       | MongoDB (Mongoose)       |
| **Authentication**           | JWT(Access & Refresh Tokens)|
| **Validation**     | Zod                         |
| **Security**       | Helmet, Express Rate Limit  |
| **Code Quality**   | ESLint, Prettier            |
---

## Documentation

Detailed internal docs are intentionally kept out of the README.
- Error handling system
- Middleware flow
- Validation patterns
- Auth & JWT flow
- Deployment notes
➡️ See /docs directory (recommended for contributors)

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

Questions or suggestions?
📧 inbx.mahbub@gmail.com

<div align="center">
Made with ❤️ by MAHBUBUR RAHMAN
</div>
