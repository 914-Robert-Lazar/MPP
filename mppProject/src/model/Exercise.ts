export default interface Exercise {
    id: number;
    name: string;
    type: string;
    level: number;
}

let count = 0;
export function createExercise(name: string, type: string, level: number) {
    return {id: count++, name: name, type: type, level: level}
}