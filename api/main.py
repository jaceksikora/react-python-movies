from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
import sqlite3


class Actor(BaseModel):
    name: str

class Movie(BaseModel):
    title: str
    year: str
    actors: list[Actor] = []

app = FastAPI()

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("../ui/build/index.html")

@app.get('/movies')
def get_movies():
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    movies_rows = cursor.execute('SELECT ID, title, year FROM movies').fetchall()

    output = []
    for movie_row in movies_rows:
        movie_id = movie_row[0]
        actors_rows = cursor.execute('SELECT name FROM actors WHERE movie_id=?', (movie_id,)).fetchall()
        actors = [{'name': a[0]} for a in actors_rows]
        movie = {'id': movie_id, 'title': movie_row[1], 'year': movie_row[2], 'actors': actors}
        output.append(movie)
    return output

@app.get('/movies/{movie_id}')
def get_single_movie(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    movie = cursor.execute("SELECT ID, title, year FROM movies WHERE id=?", (movie_id,)).fetchone()
    if movie is not None:
        actors_rows = cursor.execute('SELECT name FROM actors WHERE movie_id=?', (movie_id,)).fetchall()
        actors = [{'name': a[0]} for a in actors_rows]
        return {'id': movie[0], 'title': movie[1], 'year': movie[2], 'actors': actors}
    else:
        return {'message': "Movie not found"}


@app.post("/movies")
def add_movie(movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("INSERT INTO movies (title, year) VALUES (?, ?)", (movie.title, movie.year))
    movie_id = cursor.lastrowid

    for actor in movie.actors:
        cursor.execute("INSERT INTO actors (name, movie_id) VALUES (?, ?)", (actor.name, movie_id))

    db.commit()
    return {"message": "Movie and actors added successfully", "id": movie_id}

@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute(
        "UPDATE movies SET title = ?, year = ? WHERE id = ?",
        (movie.title, movie.year, movie_id)
    )

    cursor.execute("DELETE FROM actors WHERE movie_id = ?", (movie_id,))
    for actor in movie.actors:
        cursor.execute("INSERT INTO actors (name, movie_id) VALUES (?, ?)", (actor.name, movie_id))

    db.commit()
    if cursor.rowcount == 0:
        pass

    return {"message": f"Movie with id = {movie_id} updated successfully"}

@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM actors WHERE movie_id = ?", (movie_id,))
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    db.commit()
    if cursor.rowcount == 0:
        return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {movie_id} deleted successfully"}

@app.delete("/movies")
def delete_movies():
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM actors")
    cursor.execute("DELETE FROM movies")
    db.commit()
    return {"message": f"Deleted all movies"}


# if __name__ == '__main__':
#     app.run()
