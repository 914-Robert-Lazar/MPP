import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import Exercise from "../model/Exercise";
import { DeleteDialog } from "./DeleteEntity";


export default function ViewExercise({backendUrl, setExercises} : {backendUrl: string, setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {
    const params = useParams()
    // const exercise = exercises.find((exercise) => exercise.id == parseInt(params.id!))
    const tempExercise: Exercise = {id: 0, name: "", type: "", level: 0, muscles: []}
    const [data, setData] = useState(tempExercise);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(-1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${backendUrl}/exercises/${parseInt(params.id!)}`, {method: "GET"});
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            }catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    });

    const navigate = useNavigate()

    function handleClick() {
        navigate("/exercises");
    }

    function handleEditClick(id: number) {
        navigate(`/exercises/view/${parseInt(params.id!)}/edit/${id}`);
    }

    function handleDeleteClick(id: number) {
        setSelectedRow(id);
        setDeleteDialogOpen(true);
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    return (
        <div className="view">
            <h4>Name: {data.name}</h4>
            <h4>Type: {data.type}</h4>
            <h4>Level: {data.level}</h4>
            <h3>Used muscles:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.muscles.map(function (muscle) {
                        return  (
                            <tr key={muscle.id}>
                                <td>{muscle.name}</td>
                                <td>{muscle.size}</td>
                                <td>
                                    <button onClick={() => handleEditClick(muscle.id)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(muscle.id)}>Delete</button>
                                </td>
                            </tr>
                            
                    )})}
                </tbody>
            </table>
            <div className="addButton">  
                <button>
                        <Link to={`/exercises/view/${parseInt(params.id!)}/add`}>Add Muscle</Link>
                </button>
            </div>
            <button id="backToMenu" onClick={handleClick}>Back To Menu</button>
            <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen}
                        selectedRow={selectedRow} backendUrl={`${backendUrl}/exercises`} deleteUrl={`${backendUrl}/muscles`} setExercises={setExercises}/>
        </div>
    )
}
