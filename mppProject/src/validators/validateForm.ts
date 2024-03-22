export function validateForm(name: string, type: string, level: number) {
    if (name === "") {
        alert("The name of the exercise should not be empty.");
        return false;
    }
    if (type === "") {
        alert("You should first choose the type of exercise.");
        return false;
    }
    if (level < 1 || !Number.isInteger(level)) {
        alert("The level should be a positive integer number.");
        return false;
    }

    return true;
}