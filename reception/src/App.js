import { useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import ReceptionDashboard from "./pages/ReceptionDashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = ({ user: loggedInUser, token }) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(loggedInUser);
  };

  return user ? (
    <ReceptionDashboard user={user} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

export default App;
