import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateExerciseForm } from '../validators/validateForm.js';
import Exercise from '../model/Exercise.js';
import localForage from 'localforage';
import { ExerciseList } from '../router/router.js';

export function EditExercise({backendUrl, setExercises, status, exercises} :{backendUrl: string,
    setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>, status: string, exercises: Exercise[]}) {

    const [exercise, setExercise] = useState({name: "", type: "", level: 0})
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

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        exercise.level = Number(exercise.level);
        if (!validateExerciseForm(exercise.name, exercise.type, exercise.level)) {
            return;
        }
    
        if (status == "OK") {
            await fetch(`${backendUrl}/${parseInt(params.id!)}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json',
                    Authorization: "Bearer " + sessionStorage.getItem("bearerToken")
                },
                body: JSON.stringify(exercise)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                exercises.map((exercise) => {
                    if (exercise.id == parseInt(params.id!)) {
                        exercise.name = data.name;
                        exercise.level = data.level;
                        exercise.type = data.type;
                    }
                })
                setExercises(exercises);
            })
            .catch(error => console.error("Error fetching edit exercise", error))
            
            // await fetch(`${backendUrl}?page=0&size=50`, {
            //     method: 'GET'
            // })
            // .then(response => response.json())
            // .then(data => {
            //     setExercises(data.content);
            // })
            // .catch(error => console.error("Error fetching edit exercise", error))
        }
        else {
            const cachedExercises: Exercise[] | null = await localForage.getItem("exercises");
            const currentExercise = {id: parseInt(params.id!), name: exercise.name, type: exercise.type, level: exercise.level, numberOfMuscles: 0, muscles: []}
            
            if (cachedExercises === null) {
                localForage.setItem("exercises", ExerciseList);
            }
            for (let i = 0; i < cachedExercises!.length; ++i) {
                if (cachedExercises![i].id == parseInt(params.id!)) {
                    cachedExercises![i] = currentExercise;
                }
            }
            setExercises(cachedExercises!);
            localForage.setItem("exercises", cachedExercises);
        }
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
                <input type="button" className="formButton" value="Cancel" onClick={handleCancelClick}></input>
                <input type="submit" className="formButton" value="Edit"></input>
            </form>
        </div>
  )
}