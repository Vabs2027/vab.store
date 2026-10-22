# VAB Store

A full-stack clothing store web application built with React and Django REST Framework.

## About the Project

VAB Store is a personal project developed to practice full-stack web development, including frontend development, backend logic, and communication between the client and server.

## Technologies

### Frontend
- React
- JavaScript
- HTML
- CSS
- Axios
- Create React App (`react-scripts`)

### Backend
- Python
- Django
- Django REST Framework
- SQLite

### Tools
- Git
- GitHub
- npm

## Features

- Product catalog
- Shopping cart
- User authentication
- Favorites
- Order management

*The feature list will be updated to reflect the current implementation.*

## Project Structure

- `store/` — Django backend, `manage.py`, and `requirements.txt`
- `store-frontend/` — React frontend
- `.gitignore` — specifies files and folders excluded from Git tracking

## Getting Started

### Prerequisites

Install Python, Node.js (including npm), and Git before setting up the project.

Clone the repository and navigate to the project directory.

### Backend Setup

Open a terminal in the project root and run:

```bash
cd store
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
```

Configure the environment variables before starting Django. Create the local environment file at `store/vabstore/.env` and set the required `SECRET_KEY`. Do not commit the real `.env` file to Git.

Apply database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

### Frontend Setup

Open a separate terminal in the project root and run:

```bash
cd store-frontend
npm ci
npm start
```

The frontend uses Create React App (`react-scripts`).

### Production Build

To create an optimized frontend build, run the following command from the `store-frontend` directory:

```bash
npm run build
```

## Project Status

This project is under active development.
