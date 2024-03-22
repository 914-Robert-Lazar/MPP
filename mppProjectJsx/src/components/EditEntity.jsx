import { Exercise } from '../model/exercise.js';
import { useState } from 'react';
import { validateForm } from '../validators/validateForm.js'

export function EditExercise({setDisplayMode, selectedRow, exercises, setExercises, setTable, getExercises}) {
    const [exercise, setExercise] = useState(Exercise("", "", 0))
    function handleCancelClick() {
        setDisplayMode("NORMAL");
    }

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
        
        for (let i = 0; i < exercises.length; ++i) {
            if (exercises[i].id == selectedRow) {
                exercises[i] = exercise;
            }
        }
        setExercises(exercises);
        setTable(getExercises(exercises));
        setDisplayMode("NORMAL");
    }

    return (
        <div className="updateForm">
            <p>Edit selected exercise</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="addName">Name: </label>
                <input id="addName" type="text" name="name" value={exercise.name} onChange={handleChange}></input><br/>
                <label htmlFor="addType">Type: </label>
                <select id="addType" name="type" value={exercise.type} onChange={handleChange}>
                    <option value="push">Push</option>
                    <option value="pull">Pull</option>
                    <option value="leg">Leg</option>
                </select><br/>
                <label htmlFor="addLevel">Level: </label>
                <input type="number" id="addLevel" name="level" value={exercise.level} onChange={handleChange}></input>
                <input type="button" id="formButton" value="Cancel" onClick={handleCancelClick}></input>
                <input type="submit" id="formButton" value="Edit"></input>
            </form>
        </div>
  )
}