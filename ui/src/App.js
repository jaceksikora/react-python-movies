import './App.css';
import "milligram";
import {useEffect, useState} from "react";
import MovieForm from "./MovieForm";
import MovieListForm from "./MovieListForm";
import ActorList from "./ActorList";
import BrowserTitle from "./BrowserTitle";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);
    const API_URL = "http://127.0.0.1:8000";

    useEffect(() => {
        fetch(API_URL + "/movies")
            .then(res => res.json())
            .then(movies => setMovies(movies))
            .catch(err => console.log('Error fetching movies:', err));
    }, []);

    useEffect(() => {
        fetch(API_URL + "/actors")
            .then(res => res.json())
            .then(data => setActors(data.actors))
            .catch(err => console.error("Error fetching actors:", err));
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
        if (!window.confirm("Do you really want to delete the movie?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });


            if (response.ok) {
                setMovies(movies.filter(movie => movie.id !== movieId));
                toast.success("Film deleted!");
            } else {
                toast.error("There was an error when deleting the movie.");
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

            <ActorList />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
}

export default App;
