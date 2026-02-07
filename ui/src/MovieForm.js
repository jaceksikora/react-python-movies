import {useState} from "react";

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState([]);

    function addMovie(event) {
        event.preventDefault();
        if (title.length < 5) {
            return alert('Title is too short!');
        }
        const actorsArray = typeof actors === 'string' ? actors.split(',').map(s => s.trim()) : actors;
        props.onMovieSubmit({title, year, description, actors: actorsArray});
        setTitle('');
        setYear('');
        setDescription('');
        setActors([]);
    }

    return <form onSubmit={addMovie}>
        <h2>Add movie</h2>
        <div>
            <label>Title</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Description</label>
            <input type="text" value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <div>
            <label>Actors</label>
            <input type="text" value={actors} onChange={(event) => setActors(event.target.value)}/>
        </div>
        <button>Add a movie</button>
    </form>;
}