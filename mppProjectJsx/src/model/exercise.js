let count = 0;
export function Exercise(name, type, level) {
    return {id: count++, name: name, type: type, level: level}
}