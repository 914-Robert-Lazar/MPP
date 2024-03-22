import { Suspense, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AddExercise } from "../components/AddEntity";
import { EditExercise } from "../components/EditEntity";
import ViewExercise from "../components/ViewEntity";
import Workout from "../components/Workout";
import { ExerciseList } from "../service/ExerciseAPI";
import './router.css';

function AppRouter() {
    const [exercises, setExercises] = useState(ExerciseList);
    
    return (
        <div>
            <BrowserRouter>
                <Suspense fallback={<></>}>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/exercises"/>} />
                        <Route path="/exercises"
                            element={<Workout exercises={exercises} setExercises={setExercises}/>}
                        />
                        <Route path="/add"
                            element={<AddExercise exercises={exercises} setExercises={setExercises} />}
                        />
                        <Route path="/edit/:id"
                            element={<EditExercise exercises={exercises} setExercises={setExercises} />}
                        />
                        <Route path="/view/:id"
                            element={<ViewExercise exercises={exercises}/>}
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter;