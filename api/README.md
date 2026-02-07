# React Python Movies

A simple application for managing a movie database, using FastAPI on the backend and React on the frontend.

## Project Structure

- `api/` - Directory containing the backend application in Python.
  - `main.py` - Main FastAPI application file.
  - `movies.db` - SQLite database.
  - `requirements.txt` - Python dependencies.
- `ui/` - Directory containing the frontend application in React (should be built before running the API if it is to be served by FastAPI).

## Requirements

- Python 3.9+
- Libraries listed in `api/requirements.txt`

## Installation and Setup (API)

1. Go to the `api` directory:
   ```bash
   cd api
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the API server:
   ```bash
   uvicorn main:app --reload
   ```

The application will be available at `http://127.0.0.1:8000`.

## Features

- Browsing the movie list.
- Adding new movies and actors.
- Editing existing entries.
- Deleting movies.
- Automatic linking of actors with movies in the SQLite database.
