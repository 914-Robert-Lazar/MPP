import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import Exercise from "../model/Exercise";
import { DeleteDialog } from "./DeleteEntity";
import localForage from 'localforage';
import Muscle from "../model/Muscle";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ViewExercise({backendUrl, exercises, setExercises, status} : {backendUrl: string, exercises: Exercise[],
    setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>, status: string}) {
    const params = useParams()
    
    const tempExercise: Exercise = {id: 0, name: "", type: "", level: 0, numberOfMuscles: null, muscles: [] as Muscle[]}
    const [data, setData] = useState(tempExercise);
    const [muscles, setMuscles] = useState([] as Muscle[])
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(-1);

    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(1);

    useEffect(() => {
        
            const fetchData = async () => {
                if (status == "OK") {
                    try {
                        const response = await fetch(`${backendUrl}/exercises/${parseInt(params.id!)}`, {
                            method: "GET",
                            headers: { Authorization: "Bearer " + sessionStorage.getItem("bearerToken") }
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        const jsonData = await response.json();
                        setData(jsonData);

                        const muscleResponse = await fetch(`${backendUrl}/exercises/${parseInt(params.id!)}/muscles?page=0&size=${Math.min(data.numberOfMuscles!, 50)}`, {
                            method: "GET",
                            headers: { Authorization: "Bearer " + sessionStorage.getItem("bearerToken") }
                        });
                        if (!muscleResponse.ok) {
                            throw new Error('Network response was not ok');
                        }
                        const jsonPage = await muscleResponse.json();
                        const jsonMuscles = await jsonPage.content;
                        setMuscles(jsonMuscles);
                        if (data.numberOfMuscles! <= 50) {
                            setHasMore(false);
                        }
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
    }, []);

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

    // const [page, setPage] = useState(0)
    // const [rowsPerPage, setRowsPerPage] = useState(5);


    const muscleTable = muscles.map(function (muscle) {
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

    // const handlePageChange = (
    //     event: React.MouseEvent<HTMLButtonElement> | null,
    //     newPage: number,
    //     ) => {
    //         setPage(newPage);
    //     };

    // const handleChangeRowsPerPage = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    //     ) => {
    //         setRowsPerPage(parseInt(event.target.value, 10));
    //         setPage(0);
    //     };

    const fetchMoreData = async () => {
        await fetch(`${backendUrl}/exercises/${parseInt(params.id!)}/muscles?page=${index}&size=${Math.min(data.numberOfMuscles!, 50)}`, {
            method: 'GET',
            headers: { Authorization: "Bearer " + sessionStorage.getItem("bearerToken") }
        })
            .then(response => response.json())
            .then(data => {
                setMuscles((prevMuscles) => [...prevMuscles, ...data.content]);

                data.content.length > 0 ? setHasMore(true) : setHasMore(false);
            })
            .catch(error => console.error("Error fetching muscles", error));
        
        setIndex((prevIndex) => prevIndex + 1);
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
            <div className="addButton">  
                <button>
                        <Link to={`/exercises/view/${parseInt(params.id!)}/add`}>Add Muscle</Link>
                </button>
            </div>
            <button id="backToMenu" onClick={handleClick}>Back To Menu</button>
            <DeleteDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} selectedRow={selectedRow} 
                    deleteUrl={`${backendUrl}/exercises/${parseInt(params.id!)}/muscles`} exercises={exercises} setExercises={setExercises} status={status}
                    exerciseId={data.id} muscles={muscles} setMuscles={setMuscles}/>
            <InfiniteScroll
                dataLength={data.numberOfMuscles!}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h3>Loading...</h3>}
            >

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {muscleTable}
                        {}
                    </tbody>
                    {/* <tfoot>
                        <tr>
                        <CustomTablePagination className="pagination"
                        rowsPerPageOptions={[5, 10, 50, 100]}
                        colSpan={4}
                        count={data.numberOfMuscles!}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        </tr>
                    </tfoot> */}
                </table>
            </InfiniteScroll>
        </div>
    )
}

// const CustomTablePagination = styled(TablePagination)(
//     ({theme}) => `
//     & .${classes.toolbar}{
//         color: white;
//         font-size: large;
//     }

//     & .${classes.selectLabel} {
//         font-size: large;
//     }

//     & .${classes.displayedRows} {
//         font-size: large;
//     }

//     & .${classes.actions} {
//         font-size: large;
//     }
//     `,
// );
