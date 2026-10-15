import { useState } from "react";
import axios from "axios";
import "../App.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      if (res.data.success) {
        onLogin(res.data);
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Hotel POS</h1>
        <p>Reception Login</p>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;
