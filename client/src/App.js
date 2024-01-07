import { Routes, Route } from "react-router-dom";

import RequiredAuth from "./components/RequiredAuth";
import UnAuthorized from "./components/UnAuthorized";
import Register from "./pages/register";
import Users from "./components/Users";
import Login from "./pages/login";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<RequiredAuth allowedAccess={["Admin"]} />}>
        <Route path="/getusers" element={<Users />} />
      </Route>
    </Routes>
  );
}

export default App;
