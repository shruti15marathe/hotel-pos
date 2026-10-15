\# Hotel POS \& Kitchen Order Tracking System



A web-based Point of Sale (POS) application designed for a single hotel, with reception billing, kitchen order tracking, and administration features.



\## Main Modules



\### Reception POS

\- Create customer orders.

\- Select menu items and quantities.

\- Manage the current order and billing.

\- Generate invoices and handle payment workflows.

\- Send orders to the kitchen.



\### Kitchen Display System (KDS)

\- View incoming kitchen orders.

\- Display order tokens and items.

\- Update order statuses.

\- Support communication between Reception and Kitchen.



\### Admin Dashboard

\- Manage menu items and categories.

\- Configure hotel settings.



\### Backend

\- REST API built with Node.js and Express.

\- MySQL database connectivity.

\- Authentication and authorization components.

\- Socket.IO for real-time communication.



\## Technology Stack



\- Frontend: React

\- Backend: Node.js and Express

\- Database: MySQL

\- Real-time communication: Socket.IO



\## Project Structure



\- `admin/` — Admin dashboard

\- `reception/` — Reception POS and billing interface

\- `kitchen/` — Kitchen Display System

\- `server/` — Backend API, routes, controllers, and database configuration



\## Setup



1\. Install Node.js and MySQL.

2\. Install dependencies separately in the `server`, `reception`, `kitchen`, and `admin` folders using `npm install`.

3\. Configure the backend environment variables using `server/.env.example` as a template. Create a local `server/.env` with your actual configuration.

4\. Configure the MySQL database and required tables.

5\. Start the backend and frontend applications using their configured npm scripts.



Refer to the project's actual configuration and scripts when setting up each application.



\## Security



\- Never commit real `.env` files, passwords, database credentials, or authentication secrets.

\- Keep production credentials private.

\- Back up the database separately from the source code.



\## Project Status



This application is under development and intended for production use after testing, configuration, and deployment validation.

