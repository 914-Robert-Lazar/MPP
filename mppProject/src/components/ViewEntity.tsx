import { useNavigate, useParams } from "react-router-dom"
import Exercise from "../model/Exercise"


export default function ViewExercise({exercises} : {exercises: Exercise[]}) {
    const params = useParams()
    const exercise = exercises.find((exercise) => exercise.id == parseInt(params.id!))
    const navigate = useNavigate()

    function handleClick() {
        navigate("/exercises");
    }

    return (
        <div className="view">
            <p>Name: {exercise!.name}</p>
            <p>Type: {exercise!.type}</p>
            <p>Level: {exercise!.level}</p>
            <button onClick={handleClick}>Back To Menu</button>
        </div>
    )
}