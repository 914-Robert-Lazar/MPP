import Muscle from "./Muscle";

export default interface Exercise {
    id: number;
    name: string;
    type: string;
    level: number;
    muscles: Muscle[];
}