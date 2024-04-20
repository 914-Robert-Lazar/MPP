import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateExerciseForm } from '../validators/validateForm.js';
import Exercise from '../model/Exercise.js';

export function AddExercise({backendUrl, setExercises} : {backendUrl: string, setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {

    const [exercise, setExercise] = useState({name: "", type: "", level: 0})
    const navigate = useNavigate()

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = event.target as HTMLInputElement;
        setExercise((prevFormData) => ({...prevFormData, [name]: value}))
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target as HTMLSelectElement;
        setExercise((prevFormData) => ({...prevFormData, [name]: value}))
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        exercise.level = Number(exercise.level);
        if (!validateExerciseForm(exercise.name, exercise.type, exercise.level)) {
            return;
        }

        await fetch(backendUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(exercise)
        })
        .catch(error => console.error("Error fetching add exercise", error))

        await fetch(backendUrl, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => setExercises(data))
        .catch(error => console.error("Error fetching delete", error))
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