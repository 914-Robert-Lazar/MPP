import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Exercise, { createExercise } from '../model/Exercise.ts';
import { validateForm } from '../validators/validateForm.js';

export function AddExercise({exercises, setExercises} : {exercises: Exercise[], 
    setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {

    const [exercise, setExercise] = useState(createExercise("", "", 0))
    const navigate = useNavigate()

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = event.target as HTMLInputElement;
        setExercise((prevFormData) => ({...prevFormData, [name]: value}))
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target as HTMLSelectElement;
        setExercise((prevFormData) => ({...prevFormData, [name]: value}))
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        exercise.level = Number(exercise.level);
        if (!validateForm(exercise.name, exercise.type, exercise.level)) {
            return;
        }

        exercises.push(exercise);
        setExercises(exercises);
        // setTable(createExerciseTable(exercises));
        navigate("/exercises");
    }

    function handleCancelClick() {
        navigate("/exercises");
    }
    return (
        <div className="addForm">
            <p>Add Exercise:</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="addName">Name: </label>
                <input id="addName" name="name" type="text" value={exercise.name} onChange={handleInputChange}></input><br/>
                <label htmlFor="addType">Type: </label>
                <select id="addType" name="type" value={exercise.type} onChange={handleSelectChange}>
                    <option value="push">Push</option>
                    <option value="pull">Pull</option>
                    <option value="leg">Leg</option>
                </select><br/>
                <label htmlFor="addLevel">Level: </label>
                <input type="number" id="addLevel" name="level" value={exercise.level} onChange={handleInputChange}></input>
                <input type="button" id="formButton" value="Cancel" onClick={handleCancelClick}></input>
                <input type="submit" id="formButton" value="Add"></input>
            </form>
        </div>
  );
}