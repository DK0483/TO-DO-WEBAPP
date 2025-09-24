# TO-DO WebApp

A simple To-Do task management web application (frontend + backend) with user authentication.
Login page: https://to-do-webapp-rose.vercel.app/login.html

---

## Table of Contents

1.  [Features](#features)
2.  [Tech Stack](#tech-stack)
3.  [Getting Started](#getting-started)
    1.  [Prerequisites](#prerequisites)
    2.  [Installation](#installation)
    3.  [Running the App](#running-the-app)
4.  [Project Structure](#project-structure)
5.  [Usage](#usage)
6.  [Contributing](#contributing)
7.  [License](#license)

---

## Features

-   *User Authentication*: Secure user registration and login functionality.
-   *Add New Tasks*: Quickly add new tasks to your to-do list.
-   *View Tasks*: See all your tasks in a clean and organized list.
-   *Delete Tasks*: Remove tasks you no longer need.
-   *Responsive UI*: A beautiful and responsive user interface that works on all devices.

---

## Tech Stack

| Layer      | Technology                               |
| :--------- | :--------------------------------------- |
| Frontend   | HTML, CSS, JavaScript (with Anime.js)    |
| Backend    | Node.js, Express.js                      |
| Database   | MongoDB (with Mongoose)                  |
| Deployment | Vercel for frontend, Render for backend. |

---

## Getting Started

### Prerequisites

-   Node.js (>= 16.0)
-   npm or yarn
-   A running MongoDB instance (local or cloud-based)
-   A .env file in the todo-list-backend directory with the following variables:
    -   MONGO_URI: Your MongoDB connection string.
    -   JWT_SECRET: A secret key for signing JWTs.

### Installation

1.  Clone the repo:
    bash
    git clone [https://github.com/DK0483/TO-DO-WEBAPP.git](https://github.com/DK0483/TO-DO-WEBAPP.git)
    cd TO-DO-WEBAPP
    
2.  Install backend dependencies:
    bash
    cd todo-list-backend
    npm install
    

### Running the App

1.  Start the backend server:
    bash
    cd todo-list-backend
    node server.js
    
2.  Open the index.html file in the todo-list-frontend directory in your browser to use the application.

---

## Project Structure