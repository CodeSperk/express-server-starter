# Unified Server Kit (Express Server Starter)

A production-ready Express.js starter kit built with **TypeScript**, **MongoDB**, and **Zod**, designed for clean architecture, strict validation, and scalable backend development.

🔗 Live Preview: https://unified-server-kit.vercel.app

---

## Quick Start
```bash
# Clone the repository
git clone -b <branch-name> <your-repo-url>
ex: git clone -b unified-server-kit https://github.com/CodeSperk/express-server-starter.git

cd unified-server-kit

# Install dependencies
npm install

# Environment Variables
The server will **fail to start** if required environment variables are missing or invalid.

# Required Variables
Create a `.env` file using `.env.example` as a reference.

# Start development server
npm start
```

## Features

### Included

- Global error handling (Zod, Mongoose, JWT, Multer)
- Zod validation (request + environment)
- Async handler wrapper (no try/catch in routes)
- Centralized AppError system
- TypeScript strict mode
- ESLint & Prettier preconfigured

### Planned

- JWT Authentication
- Role-based Access Control (RBAC)
- Rate Limiting & Security Headers
- File Uploads
- Swagger API documentation

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
| **Validation**     | Zod                         |
| **Code Quality**   | ESLint, Prettier            |
---

## Documentation

Detailed internal docs are intentionally kept out of the README.
- Error handling system
- Middleware architecture
- Validation patterns
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
