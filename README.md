# Autodrama

Prototype web app scaffold (Next.js + Mongoose) for dealership service appointments.

Run locally (development):

1. Install dependencies

   npm install

2. Start a local MongoDB (recommended with Docker):

   docker-compose up -d

3. Create a .env file at the project root with:

   MONGODB_URI=mongodb://localhost:27017/autodrama
   JWT_SECRET=change_this_to_a_random_string

4. Seed the database (dev route):

   Start the dev server (npm run dev) and visit http://localhost:3000/api/seed

5. Run dev server:

   npm run dev

Notes:
- This is a prototype scaffold. It includes core Mongoose models derived from your MD files and basic credential-based auth (hashed passwords + JWT cookie).
- I will iterate on models and API after you review.
