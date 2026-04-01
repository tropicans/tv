# Corporate TV Dashboard

A modern, automated Corporate TV Dashboard that displays live meeting agendas, weather, local traffic conditions, and prayer times. It functions completely on **autopilot** without requiring a manual CMS, making it highly secure and maintenance-free.

## Features

- 📅 **Automated Meeting Agendas**: Scrapes meeting data directly from the official portal.
- 🌤️ **Live Weather**: Current weather forecast powered by BMKG.
- 🚦 **Live Traffic**: Real-time traffic data integration (via TomTom API).
- 🕋 **Prayer Times**: Automatic prayer times calculated for the local region.
- 🔒 **Secure by Design**: Completely headless backend operation with no manual administrative portals, eliminating unauthorized access risks.

## Tech Stack

- **Frontend Display**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Express.js, TypeScript, Prisma (PostgreSQL), Puppeteer (Scraping)

## Prerequisites

- Docker & Docker Compose
- Node.js (for local development)

## Getting Started

1. Clone this repository.
2. Initialize the environment variables:
   Copy the example `.env` files in both the `backend` and `frontend-display` folders.
3. Start the application stack via Docker Compose:
   ```bash
   docker compose up -d --build --remove-orphans
   ```
4. Access the dashboard:
   Open `http://localhost:6002` in your browser or Smart TV browser.
