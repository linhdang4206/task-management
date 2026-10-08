# Task Management API

Backend REST API for managing tasks and user accounts. The service uses Express and MongoDB.

## Requirements

- Node.js 20 or newer
- MongoDB connection string

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own MongoDB and email credentials.
3. Start the server:

   ```sh
   npm start
   ```

For development with automatic restarts, use `npm run dev`. The API listens on port `3000` by default; set `PORT` to change it.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/tasks` | List tasks |
| GET | `/tasks/detail/:id` | Get a task |
| POST | `/tasks/create` | Create a task |
| PATCH | `/tasks/edit/:id` | Update a task |
| PATCH | `/tasks/change-status/:id` | Change a task status |
| PATCH | `/tasks/change-multi` | Update multiple tasks |
| DELETE | `/tasks/delete/:id` | Delete a task |
| POST | `/user/register` | Register |
| POST | `/user/login` | Log in |
| POST | `/user/password/forgot` | Request a password-reset OTP |
| POST | `/user/password/otp` | Verify the OTP |
| POST | `/user/password/reset` | Reset the password |
| GET | `/user/detail` | Get the authenticated user |
| GET | `/user/list` | List users (authentication required) |

All `/tasks` endpoints and `GET /user/detail` and `GET /user/list` require authentication. Send a `Bearer` token or the `token` cookie.

## Before pushing to GitHub

- Never commit `.env`; it is ignored by Git. Use `.env.example` as the template.
- Set environment variables in your deployment provider rather than committing real credentials.
- Rotate any database or email credentials that have previously been exposed, then update your local `.env`.

## Tests

Run the Node.js test runner with `npm test`.
