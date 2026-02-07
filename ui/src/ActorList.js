import { useEffect, useState } from "react";

export default function ActorList() {
    const [actors, setActors] = useState([]);
    const API_URL = "http://127.0.0.1:8000/actors";

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setActors(data.actors))
            .catch(err => console.error("Error fetching actors:", err));
    }, []);

    return (
        <div>
            <h2>Actors in system</h2>

            {actors.length === 0 && <p>No actors found.</p>}

            <ul>
                {actors.map(actor => (
                    <li key={actor.id}>
                        {actor.fullname}
                    </li>
                ))}
            </ul>
        </div>
    );
}