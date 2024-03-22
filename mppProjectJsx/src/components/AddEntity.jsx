import { Exercise } from '../model/exercise.js';
import { useState } from 'react';
import { validateForm } from '../validators/validateForm.js'

export function AddExercise({exercises, setExercises, setTable, setDisplayMode: setDisplayMode, getExercises}) {
    const [exercise, setExercise] = useState(Exercise("", "", 0))

    const handleChange = (event) => {
        const {name, value} = event.target;
        setExercise((prevFormData) => ({...prevFormData, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        exercise.level = Number(exercise.level);
        if (!validateForm(exercise.name, exercise.type, exercise.level)) {
            return;
        }

        exercises.push(exercise);
        setExercises(exercises);
        setTable(getExercises(exercises));
        setDisplayMode("NORMAL");
    }

    function handleCancelClick() {
        setDisplayMode("NORMAL");
    }
    return (
        <div className="addForm">
            <p>Add Exercise:</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="addName">Name: </label>
                <input id="addName" name="name" type="text" value={exercise.name} onChange={handleChange}></input><br/>
                <label htmlFor="addType">Type: </label>
                <select id="addType" name="type" value={exercise.type} onChange={handleChange}>
                    <option value="push">Push</option>
                    <option value="pull">Pull</option>
                    <option value="leg">Leg</option>
                </select><br/>
                <label htmlFor="addLevel">Level: </label>
                <input type="number" id="addLevel" name="level" value={exercise.level} onChange={handleChange}></input>
                <input type="button" id="formButton" value="Cancel" onClick={handleCancelClick}></input>
                <input type="submit" id="formButton" value="Add"></input>
            </form>
        </div>
  );
}