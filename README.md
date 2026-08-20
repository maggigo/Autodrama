# Autodrama

Prototype web app scaffold (Next.js + Mongoose) for dealership service appointments.

Run locally (development):

1. Install dependencies

   npm install

2. Start a local MongoDB (recommended with Docker):

   docker-compose up -d

3. Create a .env file at the project root with (for local use only):

   Copy .env.example to .env and edit values as needed. We no longer commit a .env file to the repository.

4. Seed the database (dev route):

   Start the dev server (npm run dev) and POST to http://localhost:3000/api/seed to populate sample data (dev-only).

5. Run dev server:

   npm run dev

Notes:
- This is a prototype scaffold. It includes core Mongoose models derived from your MD files and basic credential-based auth (hashed passwords + JWT cookie).
- The repository contains an .env.example file — please create a private .env locally or in your Codespace if you need to override values. Do NOT commit secrets to the repo.
