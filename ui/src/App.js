import './App.css';
import "milligram";
import {useEffect, useState} from "react";
import MovieForm from "./MovieForm";
import MovieListForm from "./MovieListForm";
import BrowserTitle from "./BrowserTitle";

function App() {
    const [movies, setMovies] = useState([]);
    const API_URL = "http://127.0.0.1:8000/movies";

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(movies => setMovies(movies))
            .catch(err => console.log('Error fetching movies:', err));
    }, []);


    const handleAddMovie = async (movie) => {
        const formattedMovie = {
            ...movie,
            actors: movie.actors.map(actorName => ({ fullname: actorName }))
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formattedMovie)
            });

            if (response.ok) {
                fetch(API_URL)
                    .then(res => res.json())
                    .then(data => setMovies(data));
            }
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            const response = await fetch(`${API_URL}/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setMovies(movies.filter(movie => movie.id !== movieId));
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    return (
        <div className="container">
            <BrowserTitle title="Movies DB" />
            <h1>My favourite movies to watch</h1>

            <MovieListForm movies={movies} onDeleteMovie={handleDeleteMovie}/>
            <MovieForm onMovieSubmit={handleAddMovie}/>
        </div>
    );
}

export default App;
