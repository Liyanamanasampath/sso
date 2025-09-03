# Node.js SSO Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-v18-blue.svg)](https://nodejs.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)  
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-purple.svg)](https://vercel.com/)  

---

## 🚀 Project Overview

This project implements a **Single Sign-On (SSO) authentication server** using **Node.js, Express, and MongoDB**.  
It allows multiple client applications (App A, App B, etc.) to authenticate users via a central system, supporting **multi-app login, token revocation, and refresh token rotation**.

**Key Objectives:**
- Centralized authentication for multiple applications
- Secure JWT-based access & refresh tokens
- Real-time logout across all apps
- Scalable session storage using MongoDB (with optional Redis caching)
- Ready for deployment on cloud platforms like **Render** and url is https://sso-b30s.onrender.com

---

## 🌟 Features

- **User Management:** Login, registration, and profile management
- **JWT Tokens:** Access tokens (short-lived) + refresh tokens (rotatable)
- **SSO Support:** Generate SSO codes for multi-app login
- **Token Revocation:** Logout invalidates tokens across all apps
- **Session Storage:** MongoDB stores sessions and auth codes
- **Optional Redis:** Cache sessions for fast token validation
- **Environment Configurable:** Easily manage secrets via `.env` or Vercel environment variables

---

## 🛠 Tech Stack

| Layer             | Technology                                    |
|------------------|-----------------------------------------------|
| Backend           | Node.js, Express                               |
| Database          | MongoDB (Atlas or local)                      |
| Authentication    | JWT, Refresh Tokens, OAuth2 SSO              |
| Session Storage   | MongoDB (primary), Redis (optional cache)    |
| Deployment        | Vercel                                        |
| Code Quality      | ESLint, Prettier (optional)                   |

---

## 📌 API Endpoints

### Auth Routes

| Endpoint                         | Method | Description |
|---------------------------------|--------|-------------|
| `/api/auth/register`                 | POST   | Register user & return user |
| `/api/auth/login`                 | POST   | Login user & return access + refresh tokens |
| `/api/auth/refresh`               | POST   | Refresh access token using refresh token |
| `/api/auth/logout`                | POST   | Revoke all tokens for the user (multi-app logout) |
| `/api/auth/sso`                   | POST   | Generate SSO code for multi-app login |
| `/api/auth/isAuthorized`          | GET    | Validate access token & check session |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=<Your_MongoDB_URI>
JWT_SECRET=<Your_JWT_Secret>
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
REDIS_URL=<optional_redis_url>
