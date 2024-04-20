import {PieChart} from '@mui/x-charts/PieChart';
import Exercise from '../model/Exercise';
import { useNavigate } from 'react-router-dom';

function Chart({exercises} : {exercises: Exercise[]}) {
    const navigate = useNavigate()

    let counter = 0;
    let types: {[key: string]: number} = {}
    exercises.forEach((exercise) => 
    {
        if (exercise.type in types) {
            types[exercise.type]++;
        }
        else {
            types[exercise.type] = 1;
        } 
    })

    let series: { id: number; value: number; label: string; }[] = [];
    Object.keys(types).forEach((key) =>
        series.push({id: counter++, value: types[key], label: key})
    )
    return (
        <div>
            <PieChart series={[
                {
                    data: series
                }
            ]}
            width={800}
            height={400}/>
            <button onClick={() => navigate("/exercises")}>Back to menu</button>
        </div>
    )
}

export default Chart;