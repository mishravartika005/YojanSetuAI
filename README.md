# YojanSetu AI

YojanSetu AI is an AI-powered government scheme and citizen assistance navigator. It will help citizens discover and understand verified government schemes relevant to their circumstances.

## Problem

Citizens may struggle to discover government schemes that fit their personal circumstances and to understand the eligibility rules and required documents.

## Solution

Citizens will create a profile, receive matches from a verified scheme database through an eligibility engine, and get clear AI-generated explanations grounded in those records.

## Core Features

- Citizen registration, login, and profile management
- Verified scheme search and personalized recommendations
- Eligibility scores, explanations, and document checklists
- Saved schemes and application tracking
- Hindi and English support
- Provider-independent AI assistance

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide React  
Backend: Node.js, Express.js, Mongoose, JWT, bcrypt  
Database: MongoDB  
AI: Provider-independent AI service

## Architecture

Frontend -> Backend API -> Eligibility Engine -> Scheme Database -> AI Service

The eligibility engine reads citizen profiles and verified scheme criteria. The AI service explains matching data and does not independently create government scheme records.

## Project Structure

`client/` contains the Vite React application, pages, reusable components, context, hooks, and API service modules. `server/` contains the Express entry point, configuration, Mongoose models, controllers, routes, middleware, services, and seed location. `docs/` contains architecture and API notes.

## Setup

From the repository root:

```bash
npm install --prefix client
npm install --prefix server
```

Copy `server/.env.example` to `server/.env` and provide local MongoDB and JWT settings. Then run the two processes in separate terminals:

```bash
npm run dev:client
npm run dev:server
```

The client uses Vite's default URL, `http://localhost:5173`. The API listens on port `5000` by default.

## Environment Variables

`server/.env.example` documents `PORT`, `MONGODB_URI`, `JWT_SECRET`, `AI_API_KEY`, and `AI_PROVIDER`. Do not commit a real `.env` file or API keys.

## Development Roadmap

1. Project setup
2. Authentication
3. Citizen profile
4. Scheme database
5. Eligibility engine
6. Recommendations
7. AI assistant
8. Application tracking
9. Hindi/English support
10. Deployment

## Important Data Principle

Government scheme information must come from verified sources. The AI should explain available, verified scheme data rather than invent schemes or eligibility rules.
