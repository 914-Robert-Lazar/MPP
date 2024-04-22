import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AddExercise } from "../components/AddExercise";
import { EditExercise } from "../components/EditExercise";
import ViewExercise from "../components/ViewEntity";
import Workout from "../components/Workout";
import localForage from 'localforage';

import './router.css';
import Chart from "../components/Chart";
import Exercise from "../model/Exercise";
import { StompSessionProvider } from "react-stomp-hooks";
import { AddMuscle } from "../components/AddMuscle";
import { EditMuscle } from "../components/EditMuscle";
import axios from "axios";

export const ExerciseList: Exercise[] = []

function AppRouter() {
    const [exercises, setExercises] = useState(ExerciseList);
    const backendUrl = "http://localhost:8080/api";

    const [status, setStatus] = useState("Server is down");
    const [loading, setLoading] = useState(true);

    async function loadData() {
        if (navigator.onLine) {
            let isDown = false;
            await axios.get("http://localhost:8080/status")
            .catch(async error => {
                console.log(error);
                setStatus("Server is down");
                const loadedExercises: Exercise[] | null = await localForage.getItem("exercises");
                if (loadedExercises !== null) {
                    setExercises(loadedExercises!);
                }
                isDown = true;
            });
            if (!isDown) {
                setStatus("OK");
                setLoading(true);
                fetch(`${backendUrl}/exercises`, {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => {
                    setExercises(data);
                    setLoading(false);
                })
                .catch(error => console.error("Error fetching exercises", error))
            }
        }
        else {
            setStatus("No internet");
            const loadedExercises: Exercise[] | null = await localForage.getItem("exercises");
            if (loadedExercises !== null) {
                setExercises(loadedExercises!);
            }
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        const checkAvailability = async () => {
            if (navigator.onLine) {
                let isDown = false;
                await axios.get("http://localhost:8080/status")
                .catch(async error => {
                    console.log(error);
                    setStatus("Server is down");
                    isDown = true;
                });
                if (!isDown) {
                    setStatus("OK");
                }
            }
            else {
                setStatus("No internet");
            }
        }

        const intervalId = setInterval(checkAvailability, 5000);

        return () => clearInterval(intervalId);
    }, [status])

    useEffect(() => {
        if (status == "OK") {
            const update = async () =>  {
                await synchronizeData();
                await loadData();
            }

            update();
        }
        else {
            setExercises(ExerciseList);
        }
    }, [status]);

    async function synchronizeData() {
        const locallyStoredExercises: Exercise[] | null = await localForage.getItem("exercises");

        if (locallyStoredExercises !== null) {
            for (let i = 0; i < locallyStoredExercises.length; ++i) {
                await fetch(`${backendUrl}/exercises`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({name: locallyStoredExercises[i].name, type: locallyStoredExercises[i].type, 
                        level: locallyStoredExercises[i].level})
                    

                })
                .then(response => response.json())
                .then(async (data) => {
                    for (let j = 0; j < locallyStoredExercises[i].muscles.length; ++j) {
                        await fetch(`${backendUrl}/exercises/${data.id}/muscle`, {
                            method: "PUT",
                            headers: { 'Content-Type': 'application/json'},
                            body: JSON.stringify({name: locallyStoredExercises[i].muscles[j].name, size: locallyStoredExercises[i].muscles[j].size})
                        })
                        .catch(error => console.error("Error fetching load from local muscle", error))
                    }
                })
                .catch(error => console.error("Error fetching load from local exercise", error));
                
            }
        }
        await localForage.setItem("exercises", ExerciseList);
    }
    
    return (
        <div>
            <BrowserRouter>
                <Suspense fallback={<></>}>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/exercises"/>} />
                        <Route path="/exercises"
                            element={<StompSessionProvider url={'http://localhost:8080/ws-endpoint'}>
                                        <Workout exercises={exercises} backendUrl={`${backendUrl}/exercises`} setExercises={setExercises}
                                            status={status} loading={loading}/>
                                    </StompSessionProvider>}
                        />
                        <Route path="/exercises/add"
                            element={<AddExercise backendUrl={`${backendUrl}/exercises`} setExercises={setExercises} status={status}/>}
                        />
                        <Route path="/exercises/edit/:id"
                            element={<EditExercise backendUrl={`${backendUrl}/exercises`} setExercises={setExercises} status={status}/>}
                        />
                        <Route path="/exercises/view/:id"
                            element={<ViewExercise backendUrl={backendUrl} setExercises={setExercises} status={status}/>}
                        />
                        <Route path="/exercises/static"
                            element={<Chart exercises={exercises}/>}
                        />
                        <Route path="/exercises/view/:id/add"
                            element={<AddMuscle backendUrl={`${backendUrl}/exercises`} setExercises={setExercises} status={status}/>}
                        />
                        <Route path="/exercises/view/:exerciseid/edit/:muscleid"
                            element={<EditMuscle backendUrl={backendUrl} setExercises={setExercises} status={status}/>}
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;