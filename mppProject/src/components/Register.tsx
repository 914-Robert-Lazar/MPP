import { useState } from "react";
import "./Register.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

    const [user, setUser] = useState({userName: "", email: "", password: "", confirmPassword: ""})
    const navigate = useNavigate();

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {name, value} = event.target as HTMLInputElement;
        setUser((prevFormData) => ({...prevFormData, [name]: value}))
    }
    function handleSubmit(event: React.SyntheticEvent): void {
        event.preventDefault();
        if (user.password != user.confirmPassword) {
            alert("The two passwords don't match!");
            return;
        }
        const postData = {
            username: user.userName,
            password: user.password,
            email: user.email
        };
        axios
        .post("http://localhost:8080/auth/register", postData)
        .then((response) => {
            const bearerToken = response.data;
            sessionStorage.setItem("bearerToken", bearerToken["token"]);
            navigate("/exercises");
        })
        .catch((error) => {
            if (error.message == "Request failed with status code 403") {
                alert("There's already a registered user with this email.");
            }
        });

        
    }

    function toLogin(): void {
        navigate("/login");
    }

    return (
        <div>
            <h2>Register page</h2>
            <form onSubmit={handleSubmit} id="registerForm">
                <label htmlFor="userName">User Name: </label>
                <input id="userName" name="userName" type="text" value={user.userName} onChange={handleInputChange}></input><br/>
                <label htmlFor="email">Email: </label>
                <input id="email" name="email" type="text" value={user.email} onChange={handleInputChange}></input><br/>
                <label htmlFor="password">Password: </label>
                <input id="password" name="password" type="password" value={user.password} onChange={handleInputChange}></input><br/>
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={user.confirmPassword} onChange={handleInputChange}></input><br/>
                <input className="formButton" name="formButton" type="submit" value="Register"/><br/>
                <p id="alreadyText">Already have an account?</p>
                <input className="formButton" type="button" value="Login" onClick={toLogin}/>
            </form>
        </div>
    )
}