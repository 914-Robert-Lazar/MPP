import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Exercise from "../model/Exercise";
import "./Workout.css";
import { DeleteDialog } from "./DeleteEntity";
import InfiniteScroll from "react-infinite-scroll-component";

function ExerciseTable({exerciseTable} : {exerciseTable: JSX.Element[]}) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Level</th>
                        <th>Number Of Muscles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exerciseTable}
                </tbody>
            </table>
        </div>
    );
}

function WorkoutExercises({backendUrl, exerciseTable, loading, exercises, setExercises, index, setIndex} : {backendUrl: string, exerciseTable: JSX.Element[], 
    loading: boolean, exercises: Exercise[], setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
    index: number, setIndex: React.Dispatch<React.SetStateAction<number>>}) {
    const navigate = useNavigate()
    const [hasMore, setHasMore] = useState(true);

    const fetchMoreData = async () => {
        await fetch(`${backendUrl}?page=${index}&size=50`, {
            method: 'GET',
            headers: { Authorization: "Bearer " + sessionStorage.getItem("bearerToken") }
        })
            .then(response => response.json())
            .then(data => {
                setExercises((prevExercises) => [...prevExercises, ...data.content]);

                data.content.length > 0 ? setHasMore(true) : setHasMore(false);
            })
            .catch(error => console.error("Error fetching exercises", error));
        
        console.log(index);
        localStorage.setItem("scrollIndex", JSON.stringify(index + 1));
        setIndex((prevIndex: number) => prevIndex + 1);
    }

    function handleLogout(): void {
        sessionStorage.removeItem("bearerToken");
        navigate("/");
    }
    
    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }
    else {
        

        return (
            <div>
                <div className="addButton">
                    <button>
                        <Link to="/exercises/add">Add Exercise</Link>
                    </button>
                </div>
                <button id="chartButton" onClick={() => navigate("/exercises/static")}>Chart</button>
                <button id="logoutButton" onClick={handleLogout}>Log out</button>
                <InfiniteScroll
                    dataLength={exercises.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h2>Loading...</h2>}
                >
                    <ExerciseTable exerciseTable={exerciseTable}/>
                </InfiniteScroll>
            </div>
        );
    }
}

function SearchBar({filterText, setFilterText} : {filterText: string, setFilterText: React.Dispatch<React.SetStateAction<string>>}) {
    return (
        <div>
            <form className="filterForm">
                <label htmlFor="filter">Filter exercises by name: </label>
                <input id="filter" type="text" value={filterText} 
                placeholder="Search..." onChange={(e) => setFilterText(e.target.value)}></input>
            </form>
        </div>
    );
}

function Statusbar({status} : {status: string}) {

    if (status == "OK") {
        return <div></div>;
    }
    else if (status == "No internet") {
        return (
            <div id="statusMessage">
                <p>No internet connection</p>
            </div>
        )
    }
    else {
        return (
            <div id="statusMessage">
                <p>Server is down</p>
            </div>
        )
    }
}

function Workout({exercises, setExercises, backendUrl, status, loading, index, setIndex}: {exercises: Exercise[], setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>, 
    backendUrl: string, status: string, loading: boolean, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>}) {
    const navigate = useNavigate()
    

    function handleEditClick(id: number) {
        navigate(`/exercises/edit/${id}`);
    }

    function handleDeleteClick(id: number) {
        setSelectedRow(id);
        setDeleteDialogOpen(true);
    }

    const [filterText, setFilterText] = useState("");

    function createExerciseTable(exercises: Exercise[]) {
        
        return exercises.filter((exercise) => exercise.name.toLowerCase().indexOf(filterText.toLowerCase()) != -1).map(function(exercise) { 
            return (
            <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.type}</td>
                <td>{exercise.level}</td>
                <td>{exercise.numberOfMuscles}</td>
                <td>
                    <button onClick={() => handleEditClick(exercise.id)}>Edit</button>
                    <button onClick={() => handleDeleteClick(exercise.id)}>Delete</button>
                    <button onClick={() => navigate(`/exercises/view/${exercise.id}`)}>View</button>
                </td>
            </tr>
        )});
    }
    
    const [selectedRow, setSelectedRow] = useState(-1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // useEffect(() => {
    //     const socket = new WebSocket('ws://localhost:8080/ws-endpoint');
    //     const stompClient = Stomp.over(socket);

    //     stompClient.connect({}, () => {
    //         stompClient.subscribe("/topic/generatedExercise", () => {
    //             fetch(`${backendUrl}?page=0&size=50`, {
    //                 method: 'GET'
    //             })
    //                 .then(response => response.json())
    //                 .then(data => setExercises(data.content))
    //                 .catch(error => console.error("Error fetching exercises", error))
    //         })
    //     })
    // }, []);
    
    return (
        <div>
                <Statusbar status={status}/>
                <h2>Workout Exercises</h2>
                <SearchBar filterText={filterText} setFilterText={setFilterText}/>
                <WorkoutExercises exerciseTable={createExerciseTable(exercises)} loading={loading} exercises={exercises}
                    backendUrl={backendUrl} setExercises={setExercises} index={index} setIndex={setIndex}/>
                <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} selectedRow={selectedRow}
            deleteUrl={backendUrl} setExercises={setExercises} status={status} exerciseId={selectedRow} exercises={exercises} muscles={[]} setMuscles={() => {}}/>
        </div>
    )
}

export default Workout;

