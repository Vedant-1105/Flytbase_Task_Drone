# Drone Survey Backend Service

This project is a backend service designed to manage users, drones, missions, and flight logs for a drone survey/mapping system. It allows users to create missions with different types, simulate drone movements along the mission waypoints, and retrieve flight logs. The service is developed using *NestJS* and *TypeScript* with *MongoDB* as the database.

---

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Drones](#drones)
  - [Missions](#missions)
  - [Flight Logs](#flight-logs)
- [Mission Simulation](#mission-simulation)
- [Postman Collection](#postman-collection)
- [Docker Setup](#docker-setup)
- [Bonus Features](#bonus-features)
- [Technologies](#technologies)
- [License](#license)

---

## Installation

1. *Clone the repository*:

   bash
   git clone https://github.com/`<your-username>`/`<your-repo>`.git
   cd `<your-repo>`
2. *Install the dependencies*:

   bash
   npm install
3. *Run the application*:

   bash
   npm run start
4. *Build the application*:

   If you want to build the app before running:

   bash
   npm run build
   npm run start:prod

---

## Environment Variables

Create a .env file at the root of your project and add the following environment variables:

bash
PORT=3000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

---

## API Endpoints

### Authentication

- *Login*: POST /auth/login

  Use this endpoint to authenticate a user. The token obtained can be used for subsequent requests.

### Drones

- *Create Drone*: POST /drones
- *Get Drones*: GET /drones
- *Update Drone*: PATCH /drones/:id
- *Delete Drone*: DELETE /drones/:id

### Missions

- *Create Mission*: POST /missions
- *Get Missions*: GET /missions
- *Update Mission*: PATCH /missions/:id
- *Delete Mission*: DELETE /missions/:id

### Flight Logs

- *Get Flight Log by Flight ID*: GET /flight-log/:id

---

## Mission Simulation

- *Start Mission*: POST /missions/:id/start
- *Stop Mission*: POST /missions/:id/stop

These endpoints simulate the movement of the drone along the waypoints of a mission.

---

## Postman Collection

A Postman collection has been provided to help you test the APIs. You can import it from the following location:

- *[Postman Collection URL]*

Instructions for running the Postman tests are provided inside the collection.

---

## Docker Setup

To run the application using Docker:

1. *Build the Docker image*:

   bash
   docker build -t drone-backend-service .
2. *Run the Docker container*:

   bash
   docker run -p 3000:3000 --env-file .env drone-backend-service

---

## Bonus Features

1. *PDF Generation for Flight Logs*:You can generate a PDF report of the flight logs with the endpoint:

   - GET /flight-log/:id/pdf
2. *Dockerized Application*:
   The application can be easily containerized and deployed using Docker.

---

## Technologies

- *ExpressJS* (Node.js framework)
- *TypeScript* (for static typing)
- *MongoDB* (for storing users, drones, missions, and logs)
- *JWT* (for authentication)