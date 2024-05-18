import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Workout.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    function handleSubmit(event: React.SyntheticEvent): void {
      event.preventDefault();
      const postData = {
        email: email,
        password: password,
      };
      axios
        .post("http://localhost:8080/auth/authenticate", postData)
        .then((response) => {
            const bearerToken = response.data;
            sessionStorage.setItem("bearerToken", bearerToken["token"]);
            navigate("/exercises");
        })
        .catch(error => {
            if (error.message == "Request failed with status code 403") {
                alert("The email and password combination is not correct.");
            }
        });
    }
  
    function handleRegisterNav(): void {
      navigate("/register");
    }
  
    return (
        <div className="authForm">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                <input type="submit" className="formButton" value="Login"/><br/>
                <input type="button" className="formButton" value="Register" onClick={handleRegisterNav}/>
            </form>
        </div>
    );
  };
  
  export default Login;
  