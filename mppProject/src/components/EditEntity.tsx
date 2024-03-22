import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Exercise, { createExercise } from '../model/Exercise.ts';
import { validateForm } from '../validators/validateForm.js';

export function EditExercise({exercises, setExercises} :{exercises: Exercise[], 
    setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {

    const [exercise, setExercise] = useState(createExercise("", "", 0))
    const navigate = useNavigate()
    const params = useParams()


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
    
        for (let i = 0; i < exercises.length; ++i) {
            if (exercises[i].id == parseInt(params.id!)) {
                exercises[i] = exercise;
            }
        }
        setExercises(exercises);
        navigate("/exercises");
    }

    function handleCancelClick() {
        navigate("/exercises");
    }

    return (
        <div className="updateForm">
            <p>Edit selected exercise</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="addName">Name: </label>
                <input id="addName" type="text" name="name" value={exercise.name} onChange={handleInputChange}></input><br/>
                <label htmlFor="addType">Type: </label>
                <select id="addType" name="type" value={exercise.type} onChange={handleSelectChange}>
                    <option value="push">Push</option>
                    <option value="pull">Pull</option>
                    <option value="leg">Leg</option>
                </select><br/>
                <label htmlFor="addLevel">Level: </label>
                <input type="number" id="addLevel" name="level" value={exercise.level} onChange={handleInputChange}></input>
                <input type="button" id="formButton" value="Cancel" onClick={handleCancelClick}></input>
                <input type="submit" id="formButton" value="Edit"></input>
            </form>
        </div>
  )
}