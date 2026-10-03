# ⚙️ RankQuest Backend API

> The robust, secure REST API backend powering **RankQuest**, built with Java 21, Spring Boot 3.5, Spring Security 6, and Spring Data JPA.

---

## ⚡ Features

- **Layered Enterprise Architecture**: Clean separation of concerns across Controllers, Services, Repositories, Entities, and DTOs.
- **Dual Database Strategy**:
  - **In-Memory H2 Database**: Zero-configuration default for rapid local development and automated integration testing.
  - **PostgreSQL with HikariCP**: Production-grade connection pooling and high-throughput query execution.
- **Stateless Authentication & Security**:
  - JSON Web Tokens (JJWT) with HMAC SHA-256 signatures.
  - BCrypt password hashing.
  - Role-based authorization (`ROLE_USER`, `ROLE_ADMIN`).
  - Google OAuth 2.0 single sign-on support.
  - In-app password change endpoint verifying the user's current password.
  - Self-service password reset flow (`/api/auth/reset-password`).
- **Profile & Avatar Management**:
  - Secure multipart image upload (`/api/users/avatar`) with file sanitization and MIME-type validation.
  - Fast static file streaming (`/api/users/avatar/{filename}`) with public access bypass.
- **Code Submission & Evaluation**:
  - Integrates with Judge0 CE API to execute user code in sandboxed containers.
  - Records execution metrics: status verdict, runtime milliseconds, and memory consumption.
- **Automated Test Suite**:
  - Unit and integration tests covering authentication, user profiles, avatar uploads, and password security.

---

## 🛠️ Tech Stack

- **Language**: [Java 21 LTS](https://openjdk.org/projects/jdk/21/)
- **Framework**: [Spring Boot 3.5](https://spring.io/projects/spring-boot)
- **Security**: [Spring Security 6](https://spring.io/projects/spring-security)
- **Persistence**: [Spring Data JPA](https://spring.io/projects/spring-data-jpa) & [Hibernate ORM](https://hibernate.org/)
- **Database**: H2 (dev) / PostgreSQL (prod)
- **Tokens**: [jjwt 0.12.5](https://github.com/jwtk/jjwt)
- **Build Tool**: Apache Maven (via `mvnw` wrapper)
- **Containerization**: Multi-stage Docker

---

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK)**: Version 21 or later
- **Maven**: (Included via `./mvnw` wrapper)

### Running Locally (Development Mode)

1. Navigate to the backend directory:
   ```bash
   cd Back-End
   ```

2. Run the application with the Maven wrapper:
   - **Linux / macOS:**
     ```bash
     ./mvnw spring-boot:run
     ```
   - **Windows:**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```

3. The server starts on port `8080`:
   - Base URL: `http://localhost:8080/api`
   - In-memory H2 Console: `http://localhost:8080/h2-console`
     - **JDBC URL:** `jdbc:h2:mem:rankquest`
     - **User:** `sa`
     - **Password:** *(empty)*

---

## 🔑 Configuration & Environment Variables

All configuration settings are managed via `src/main/resources/application.properties` and can be overridden via environment variables:

| Environment Variable | Property Key | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `SERVER_PORT` | `server.port` | `8080` | Port on which the Spring Boot server listens |
| `DB_URL` | `spring.datasource.url` | `jdbc:h2:mem:rankquest;...` | Database connection string (PostgreSQL in prod) |
| `DB_USERNAME` | `spring.datasource.username`| `sa` | Database user |
| `DB_PASSWORD` | `spring.datasource.password`| *(empty)* | Database password |
| `JWT_SECRET` | `app.jwt.secret` | *(built-in 256-bit key)* | Secret key for JWT signing and verification |
| `JWT_EXPIRATION_MS` | `app.jwt.expiration-ms` | `86400000` (24h) | JWT expiration time in milliseconds |

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student/user.
- `POST /api/auth/login` — Authenticate user and return JWT bearer token.
- `POST /api/auth/reset-password` — Reset account password.

### 👤 Users (`/api/users`)
- `GET /api/users/profile` — Fetch current user profile and stats *(Authenticated)*.
- `PUT /api/users/profile` — Update name, bio, college, branch, or links *(Authenticated)*.
- `PUT /api/users/password` — Change password after verifying current password *(Authenticated)*.
- `POST /api/users/avatar` — Upload custom avatar image file *(Authenticated, multipart/form-data)*.
- `GET /api/users/avatar/{filename}` — Stream user avatar image *(Public)*.

### 💻 Problems & Sheets (`/api/problems`, `/api/sheets`)
- `GET /api/problems` — List all coding problems with tags and difficulty.
- `GET /api/problems/{id}` — Fetch full problem statement, test cases, and constraints.
- `GET /api/sheets` — List curated DSA sheets (e.g., Striver SDE, NeetCode 150).
- `GET /api/sheets/{id}` — Retrieve sheet details and associated problems.

### 📜 Submissions & Rankings (`/api/submissions`, `/api/rankings`)
- `POST /api/submissions` — Submit solution for automated evaluation *(Authenticated)*.
- `GET /api/submissions/user` — Fetch user's submission history and verdicts *(Authenticated)*.
- `GET /api/rankings` — Retrieve global and college-specific leaderboard.

### 🛡️ Admin Portal (`/api/admin`)
- `GET /api/admin/users` — List and manage platform users *(Admin only)*.
- `DELETE /api/admin/users/{id}` — Deactivate or remove user account *(Admin only)*.

---

## 🧪 Testing

Execute the test suite using the Maven wrapper:

```bash
# Run all unit and integration tests
./mvnw test

# Run a specific test class
./mvnw test -Dtest=ProfileAndPasswordIntegrationTest
```

---

## 🐳 Docker Deployment

The included multi-stage `Dockerfile` compiles the Spring Boot jar and produces an optimized, lightweight runtime image:

```bash
# Build the image
docker build -t rankquest-backend .

# Run container with custom environment variables
docker run -p 8080:8080 \
  -e DB_URL="jdbc:postgresql://<host>:5432/<dbname>" \
  -e DB_USERNAME="<user>" \
  -e DB_PASSWORD="<password>" \
  -e JWT_SECRET="<your-production-secret-key>" \
  rankquest-backend
```
