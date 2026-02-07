import React from 'react';

export default function MovieListForm(props) {
    return (
        <div>
            {props.movies.map((movie, index) => (
                <li key={`${movie.id || movie.title}-${index}`}>
                    <strong>{movie.title}</strong> ({movie.year}) - {movie.description}
                    {movie.actors && (
                        <span> – Aktorzy: {Array.isArray(movie.actors)
                            ? movie.actors.map(actor => actor.fullname).join(", ")
                            : movie.actors}
            </span>
                    )}
                    <button
                        onClick={() => props.onDeleteMovie(movie.id)}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </div>
    );
}