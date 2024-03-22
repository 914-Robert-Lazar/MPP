import { useState } from "react";
import { Exercise } from '../model/exercise.js';
import { AddExercise } from "./AddEntity.jsx";
import { EditExercise } from "./EditEntity.jsx";
import { DeleteDialog } from "./DeleteEntity.jsx";
import "./Home.css";

function ViewExercise({exercise, setDisplayMode}) {
    function handleClick() {
        setDisplayMode("NORMAL");
    }

    return (
        <div className="view">
            <p>Name: {exercise.name}</p>
            <p>Type: {exercise.type}</p>
            <p>Level: {exercise.level}</p>
            <button onClick={handleClick}>Back To Menu</button>
        </div>
    )
}

function ExerciseTable({exerciseTable}) {
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

function WorkoutExercises({setDisplayMode: setDisplayMode, exerciseTable}) {
    function handleAddClick() {
        setDisplayMode("ADD");
    }
    return (
        <div>
            <h2>Workout Exercises</h2>
            <ExerciseTable exerciseTable={exerciseTable}/>
            <div className="addButton">
                <button onClick={handleAddClick}>Add Exercise</button>
            </div>
        </div>
    );
}

function Workout() {
    const [displayMode, setDisplayMode] = useState("NORMAL");
    const [exercises, setExercises] = useState([
        Exercise("Push-up", "push", 2),
        Exercise("Pull-up", "pull", 3),
        Exercise("One leg squat", "leg", 4)
    ])

    const [exerciseTable, setTable] = useState(createExerciseTable(exercises, setExercises));
    const [selectedRow, setSelectedRow] = useState(-1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    function handleEditClick(id) {
        setSelectedRow(id);
        setDisplayMode("EDIT");
    }

    function handleDeleteClick(id) {
        setSelectedRow(id);
        setDeleteDialogOpen(true);
    }

    function handleViewClick(id) {
        setSelectedRow(id);
        setDisplayMode("VIEW");
    }

    function createExerciseTable(exercises) {
        return exercises.map(function(exercise) { return (
            <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.type}</td>
                <td>{exercise.level}</td>
                <td>
                    <button onClick={() => handleEditClick(exercise.id)}>Edit</button>
                    <button onClick={() => handleDeleteClick(exercise.id)}>Delete</button>
                    <button onClick={() => handleViewClick(exercise.id)}>View</button>
                </td>
            </tr>
        )});
    }

    if (displayMode === "ADD") {
        return (
            <div>
                <AddExercise exercises={exercises} setExercises={setExercises} setTable={setTable} 
                setDisplayMode={setDisplayMode} getExercises={createExerciseTable}/>
            </div>
        )
    }
    else if (displayMode === "EDIT") {
        return (
            <div>
                <EditExercise setDisplayMode={setDisplayMode} selectedRow={selectedRow} setExercises={setExercises}
                exercises={exercises} setTable={setTable} getExercises={createExerciseTable}/>
            </div>
        )
    }
    else if (displayMode === "VIEW") {
        return (
            <div>
                <ViewExercise exercise={exercises.find((exercise) => exercise.id == selectedRow)} setDisplayMode={setDisplayMode}/>
            </div>
        )
    }
    else {
        return (
            <div>
                <WorkoutExercises setDisplayMode={setDisplayMode} exerciseTable={exerciseTable}/>
                <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen}
                selectedRow={selectedRow} exercises={exercises} setExercises={setExercises} setTable={setTable} getExercises={createExerciseTable}/>
            </div>
        )
    }
}

export default Workout;

