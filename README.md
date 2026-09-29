# 🚀 RankQuest — Competitive Programming & DSA Platform

> A full-stack platform designed for competitive programmers to track progress, solve problems using an integrated code editor, and compete on global and college leaderboards.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://rank-quest.vercel.app/)
[![Backend Status](https://img.shields.io/badge/Backend-Live-blue?style=for-the-badge&logo=render)](https://rankquest-backend.onrender.com)

---

## 📸 Screenshots

### 💻 Problem Solver & Code Editor
Write, edit, and test your code in real-time with an integrated Monaco editor and Judge0 evaluation.
<img width="1881" height="1060" alt="image" src="https://github.com/user-attachments/assets/2a79caa9-bd69-4c12-82b5-7d167da45d5f" />


### 🏆 Global & College Rankings
Track your progress and compete globally or within your institution and improve coding culture in college.
<img width="1860" height="1063" alt="image" src="https://github.com/user-attachments/assets/04aebc81-5d19-4cc0-b67d-0dc0f2e7b487" />
<img width="920" height="529" alt="image" src="https://github.com/user-attachments/assets/d387de86-7e37-463a-95bf-be73adc46263" />

---

## ✨ Key Features

- **Integrated Code Playground**: Powered by Monaco Editor, allowing users to write, edit, and test code seamlessly.
- **Automated Code Evaluation**: Integrated with Judge0 API via RapidAPI to compile and evaluate user code submissions across multiple programming languages in real-time.
- **Dual Leaderboards**: View rankings globally or filter them specifically by your college or institution.
- **Secure Authentication**: Implements JWT and Google OAuth 2.0 with Spring Security and BCrypt password hashing.
- **Protected Routing & Role Management**: Secure frontend routes and backend endpoints safeguarding user submissions, profiles, and data.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.5, Spring Security, JPA/Hibernate, H2 (dev) / Aiven PostgreSQL (prod) |
| **Code Execution** | Judge0 API (RapidAPI) |
| **Auth** | JWT (jjwt) + Google OAuth 2.0, BCrypt password hashing |
| **Frontend** | React 18, Vite, TailwindCSS, Monaco Editor |
| **Deployment** | Render (backend Docker), Vercel (frontend), Aiven Cloud DB |

---

## 📁 Project Structure

```text
RankQuest-Platform-DSA/
├── Back-End/
│   ├── src/                         # Backend source code (Java/Spring Boot)
│   ├── Dockerfile                   # Multi-stage Docker build
│   ├── HELP.md                      # Spring Boot documentation
│   ├── mvnw                         # Maven wrapper script (Unix)
│   ├── mvnw.cmd                     # Maven wrapper script (Windows)
│   └── pom.xml                      # Maven dependencies
├── Front-End/
│   ├── .vite/                       # Vite build cache
│   ├── src/                         # React components, pages, and services
│   ├── .gitignore                   # Frontend git ignore rules
│   ├── README.md                    # Frontend-specific documentation
│   ├── index.html                   # Main HTML entry point
│   ├── package-lock.json            # Exact dependency versions
│   ├── package.json                 # Node dependencies and scripts
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── vercel.json                  # Vercel SPA routing config
│   └── vite.config.js               # Vite bundler configuration
├── .gitignore                       # Root git ignore rules
└── README.md                        # Main project documentation
