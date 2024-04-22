import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import Exercise from "../model/Exercise";
import { DeleteDialog } from "./DeleteEntity";
import localForage from 'localforage';
import { TablePagination, tablePaginationClasses as classes} from "@mui/material";
import {styled} from '@mui/system';

export default function ViewExercise({backendUrl, setExercises, status} : {backendUrl: string, 
    setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>, status: string}) {
    const params = useParams()
    
    const tempExercise: Exercise = {id: 0, name: "", type: "", level: 0, muscles: []}
    const [data, setData] = useState(tempExercise);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(-1);

    useEffect(() => {
        
            const fetchData = async () => {
                if (status == "OK") {
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
                }
                else {
                    const cachedExercises: Exercise[] | null = await localForage.getItem("exercises");
                    setData(cachedExercises!.find((exercise) => exercise.id == parseInt(params.id!))!);
                    setLoading(false);
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

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const muscleTable = data.muscles.map(function (muscle) {
        return  (
            <tr key={muscle.id}>
                <td>{muscle.name}</td>
                <td>{muscle.size}</td>
                <td>
                    <button onClick={() => handleEditClick(muscle.id)}>Edit</button>
                    <button onClick={() => handleDeleteClick(muscle.id)}>Delete</button>
                </td>
            </tr>
            
    )})

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
        ) => {
            setPage(newPage);
        };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

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
                    {(rowsPerPage > 0
                        ? muscleTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : muscleTable)}
                    {}
                </tbody>
                <tfoot>
                    <tr>
                        <CustomTablePagination className="pagination"
                            rowsPerPageOptions={[5, 10, 50, 100]}
                            colSpan={4}
                            count={data.muscles.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </tr>
                </tfoot>
            </table>
            <div className="addButton">  
                <button>
                        <Link to={`/exercises/view/${parseInt(params.id!)}/add`}>Add Muscle</Link>
                </button>
            </div>
            <button id="backToMenu" onClick={handleClick}>Back To Menu</button>
            <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} selectedRow={selectedRow} 
                    backendUrl={`${backendUrl}/exercises`} deleteUrl={`${backendUrl}/muscles`} setExercises={setExercises} status={status}
                    exerciseId={data.id}/>
        </div>
    )
}

const CustomTablePagination = styled(TablePagination)(
    ({theme}) => `
    & .${classes.toolbar}{
        color: white;
        font-size: large;
    }

    & .${classes.selectLabel} {
        font-size: large;
    }

    & .${classes.displayedRows} {
        font-size: large;
    }

    & .${classes.actions} {
        font-size: large;
    }
    `,
);
