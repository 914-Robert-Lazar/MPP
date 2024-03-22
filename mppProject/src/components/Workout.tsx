import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Exercise from "../model/Exercise";
import "./Workout.css";
import { DeleteDialog } from "./DeleteEntity";

function ExerciseTable({exerciseTable} : {exerciseTable: JSX.Element[]}) {
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
                    {exerciseTable}
                </tbody>
            </table>
        </div>
    );
}

function WorkoutExercises({exerciseTable} : {exerciseTable: JSX.Element[]}) {
    return (
        <div>
            <h2>Workout Exercises</h2>
            <ExerciseTable exerciseTable={exerciseTable}/>
            <div className="addButton">
                <button>
                    <Link to="/add">Add Exercise</Link>
                </button>
            </div>
        </div>
    );
}

function Workout({exercises, setExercises}: {exercises: Exercise[], setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {

    const navigate = useNavigate()

    function handleEditClick(id: number) {
        navigate(`/edit/${id}`);
    }

    function handleDeleteClick(id: number) {
        setSelectedRow(id);
        setDeleteDialogOpen(true);
    }

    function createExerciseTable(exercises: Exercise[]) {
        return exercises.map(function(exercise) { return (
            <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.type}</td>
                <td>{exercise.level}</td>
                <td>
                    <button onClick={() => handleEditClick(exercise.id)}>Edit</button>
                    <button onClick={() => handleDeleteClick(exercise.id)}>Delete</button>
                    <button onClick={() => navigate(`/view/${exercise.id}`)}>View</button>
                </td>
            </tr>
        )});
    }
    
    const [selectedRow, setSelectedRow] = useState(-1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    return (
        <div>
            <WorkoutExercises exerciseTable={createExerciseTable(exercises)}/>
            <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen}
                selectedRow={selectedRow} exercises={exercises} setExercises={setExercises}/>
        </div>
    )
}

export default Workout;

