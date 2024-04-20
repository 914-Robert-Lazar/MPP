import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Exercise from "../model/Exercise";
import "./Workout.css";
import { DeleteDialog } from "./DeleteEntity";
import { TablePagination, tablePaginationClasses as classes} from "@mui/material";
import {styled} from '@mui/system'
import axios from "axios";
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
                            rowsPerPageOptions={[5, 10]}
                            colSpan={4}
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

function WorkoutExercises({exerciseTable} : {exerciseTable: JSX.Element[]}) {
    return (
        <div>
            <ExerciseTable exerciseTable={exerciseTable}/>
            <div className="addButton">
                <button>
                    <Link to="/exercises/add">Add Exercise</Link>
                </button>
            </div>
        </div>
    );
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

function Workout({exercises, setExercises, backendUrl}: {exercises: Exercise[], setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>, 
    backendUrl: string}) {
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
    const [status, setStatus] = useState("Server is down");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (navigator.onLine) {
            const checkStatus = async () => {
                await axios.get("http://localhost:8080/status")
                .catch(error => {
                    console.log(error);
                    setStatus("Server is down");
                    setLoading(false);
                    return;
                });
            }
            checkStatus();
            setStatus("OK");
            setLoading(false);
        }
        else {
            setStatus("No internet");
            setLoading(false);
        }
        console.log(status);
    }, [])

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
    
    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    else {
        if (status == "OK") {
            return (
                <div>
                        <h2>Workout Exercises</h2>
                        <SearchBar filterText={filterText} setFilterText={setFilterText}/>
                        <WorkoutExercises exerciseTable={createExerciseTable(exercises)}/>
                        <button id="chartButton" onClick={() => navigate("/exercises/static")}>Chart</button>
                        <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen}
                            selectedRow={selectedRow} backendUrl={backendUrl} deleteUrl={backendUrl} setExercises={setExercises}/>
                </div>
            )
        }
        else if (status == "No internet") {
            return (
                <div>
                    <p>No internet connection</p>
                </div>
            )
        }
        else {
            return (
                <div>
                    <p>Server is down</p>
                </div>
            )
        }
    }
}

export default Workout;

