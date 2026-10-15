import { useState } from "react";
import axios from "axios";
import KitchenDashboard from "./pages/KitchenDashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const login = async (event) => {
    event.preventDefault();
    setLoginError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      if (!data.success) return setLoginError(data.message || "Login failed");
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      setAuthenticated(true);
    } catch {
      setLoginError("Could not sign in. Check your credentials and server connection.");
    }
  };

  if (!authenticated) {
    return (
      <div className="auth-screen">
        <form className="auth-card" onSubmit={login}>
          <h1>Hotel POS</h1><p>Kitchen sign in</p>
          <label>Username<input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {loginError && <p className="auth-error" role="alert">{loginError}</p>}
          <button type="submit">Sign in</button>
        </form>
      </div>
    );
  }

  return <KitchenDashboard />;
}

export default App;
