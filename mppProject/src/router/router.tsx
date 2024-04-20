import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AddExercise } from "../components/AddExercise";
import { EditExercise } from "../components/EditExercise";
import ViewExercise from "../components/ViewEntity";
import Workout from "../components/Workout";

import './router.css';
import Chart from "../components/Chart";
import Exercise from "../model/Exercise";
import { StompSessionProvider } from "react-stomp-hooks";
import { AddMuscle } from "../components/AddMuscle";
import { EditMuscle } from "../components/EditMuscle";

const ExerciseList: Exercise[] = []

function AppRouter() {
    const [exercises, setExercises] = useState(ExerciseList);
    const backendUrl = "http://localhost:8080/api";
    useEffect(() => {
        fetch(`${backendUrl}/exercises`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setExercises(data))
            .catch(error => console.error("Error fetching exercises", error))
    }, [])
    
    return (
        <div>
            <BrowserRouter>
                <Suspense fallback={<></>}>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/exercises"/>} />
                        <Route path="/exercises"
                            element={<StompSessionProvider url={'http://localhost:8080/ws-endpoint'}>
                                        <Workout exercises={exercises} backendUrl={`${backendUrl}/exercises`} setExercises={setExercises}/>
                                    </StompSessionProvider>}
                        />
                        <Route path="/exercises/add"
                            element={<AddExercise backendUrl={`${backendUrl}/exercises`} setExercises={setExercises}/>}
                        />
                        <Route path="/exercises/edit/:id"
                            element={<EditExercise backendUrl={`${backendUrl}/exercises`} setExercises={setExercises}/>}
                        />
                        <Route path="/exercises/view/:id"
                            element={<ViewExercise backendUrl={backendUrl} setExercises={setExercises}/>}
                        />
                        <Route path="/exercises/static"
                            element={<Chart exercises={exercises}/>}
                        />
                        <Route path="/exercises/view/:id/add"
                            element={<AddMuscle backendUrl={`${backendUrl}/exercises`} setExercises={setExercises}/>}
                        />
                        <Route path="/exercises/view/:exerciseid/edit/:muscleid"
                            element={<EditMuscle backendUrl={backendUrl} setExercises={setExercises}/>}
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;