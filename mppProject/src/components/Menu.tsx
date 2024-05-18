import { Link } from "react-router-dom";
import "./Workout.css";

export default function Menu() {
    return (
        <div>
            <h2>Welcome to The Workout Page!</h2>
            <Link to={"/register"}>
                <button id="chartButton">Sign Up</button>
            </Link><br/>
            <Link to={"/login"}>
                <button id="chartButton">Login</button>
            </Link>
        </div>
    )
}