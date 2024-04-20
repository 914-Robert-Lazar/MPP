import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateMuscleForm } from '../validators/validateForm.js';
import Exercise from '../model/Exercise.js';

export function AddMuscle({backendUrl, setExercises} : {backendUrl: string, setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {

    const [muscle, setMuscle] = useState({name: "", size: 0})
    const navigate = useNavigate()
    const params = useParams()

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = event.target as HTMLInputElement;
        setMuscle((prevFormData) => ({...prevFormData, [name]: value}))
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        muscle.size = Number(muscle.size);
        if (!validateMuscleForm(muscle.name, muscle.size)) {
            return;
        }

        await fetch(`${backendUrl}/${parseInt(params.id!)}/muscle`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(muscle)
        })
        .catch(error => console.error("Error fetching add muscle", error))

        await fetch(backendUrl, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => setExercises(data))
        .catch(error => console.error("Error fetching delete", error))
        navigate(`/exercises/view/${parseInt(params.id!)}`);
    }

    function handleCancelClick() {
        navigate(`/exercises/view/${parseInt(params.id!)}`);
    }
    return (
        <div className="addForm">
            <p>Add Muscle:</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="addName">Name: </label>
                <input id="addName" name="name" type="text" value={muscle.name} onChange={handleInputChange}></input><br/>
                <label htmlFor="addSize">Size: </label>
                <input type="number" id="addSize" name="size" value={muscle.size} onChange={handleInputChange}></input>
                <input type="button" id="formButton" value="Cancel" onClick={handleCancelClick}></input>
                <input type="submit" id="formButton" value="Add"></input>
            </form>
        </div>
  );
}