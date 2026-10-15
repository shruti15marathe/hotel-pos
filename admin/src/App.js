
import { useState } from "react";
import axios from "axios";
import "./App.css";
import HotelSettings from "./pages/HotelSettings";
import MenuManagement from "./pages/MenuManagement";
import CategoryManagement from "./pages/CategoryManagement";

function App() {
  const [page, setPage] = useState("hotel");
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
          <h1>Hotel POS</h1><p>Admin sign in</p>
          <label>Username<input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {loginError && <p className="auth-error" role="alert">{loginError}</p>}
          <button type="submit">Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>Hotel POS</h2>
          <span>Admin Panel</span>
        </div>

        <nav>
          <button
            className={page === "hotel" ? "active" : ""}
            onClick={() => setPage("hotel")}
          >
            Hotel Settings
          </button>

          <button
            className={page === "menu" ? "active" : ""}
            onClick={() => setPage("menu")}
          >
            Menu Management
          </button>

          <button
            className={page === "categories" ? "active" : ""}
            onClick={() => setPage("categories")}
          >
            Categories
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="topbar">
          <div>
            <h1>
              {page === "hotel" && "Hotel Settings"}
              {page === "menu" && "Menu Management"}
              {page === "categories" && "Categories"}
            </h1>
            <p>Hotel POS Administration</p>
          </div>

          <div className="admin-user">
            <div className="avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <section className="content">
          {page === "hotel" && <HotelSettings />}
          {page === "menu" && <MenuManagement />}
          {page === "categories" && <CategoryManagement />}
        </section>
      </main>
    </div>
  );
}

export default App;
