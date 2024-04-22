import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Exercise from "../model/Exercise";
import "./Workout.css";
import { DeleteDialog } from "./DeleteEntity";
import { TablePagination, tablePaginationClasses as classes} from "@mui/material";
import {styled} from '@mui/system';
import Stomp from 'stompjs';

function ExerciseTable({exerciseTable} : {exerciseTable: JSX.Element[]}) {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
        ) => {
            setPage(newPage);
        };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

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
                    {(rowsPerPage > 0
                        ? exerciseTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : exerciseTable)}
                </tbody>
                <tfoot>
                    <tr>
                        <CustomTablePagination className="pagination"
                            rowsPerPageOptions={[5, 10, 50, 100]}
                            colSpan={5}
                            count={exerciseTable.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

const CustomTablePagination = styled(TablePagination)(
    ({theme}) => `
    & .${classes.toolbar}{
        color: white;
        font-size: large;
    }

    & .${classes.selectLabel} {
        font-size: large;
    }

    & .${classes.displayedRows} {
        font-size: large;
    }

    & .${classes.actions} {
        font-size: large;
    }
    `,
);

function WorkoutExercises({exerciseTable, loading} : {exerciseTable: JSX.Element[], loading: boolean}) {
    const navigate = useNavigate()
    
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
                <ExerciseTable exerciseTable={exerciseTable}/>
                <div className="addButton">
                    <button>
                        <Link to="/exercises/add">Add Exercise</Link>
                    </button>
                </div>
                <button id="chartButton" onClick={() => navigate("/exercises/static")}>Chart</button>
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

function Workout({exercises, setExercises, backendUrl, status, loading}: {exercises: Exercise[], setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>, 
    backendUrl: string, status: string, loading: boolean}) {
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
                <td>{exercise.muscles.length}</td>
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

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws-endpoint');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/generatedExercise", () => {
                fetch(backendUrl, {
                    method: 'GET'
                })
                    .then(response => response.json())
                    .then(data => setExercises(data))
                    .catch(error => console.error("Error fetching exercises", error))
            })
        })
    }, []);
    
    return (
        <div>
                <Statusbar status={status}/>
                <h2>Workout Exercises</h2>
                <SearchBar filterText={filterText} setFilterText={setFilterText}/>
                <WorkoutExercises exerciseTable={createExerciseTable(exercises)} loading={loading}/>
                <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} selectedRow={selectedRow}
                    backendUrl={backendUrl} deleteUrl={backendUrl} setExercises={setExercises} status={status} exerciseId={selectedRow}/>
        </div>
    )
}

export default Workout;

