import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transacciones from "./pages/Transacciones";
import Transferencias from "./pages/Transferencias";
import Configuracion from "./pages/Configuracion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/transacciones" element={<Transacciones />} /> 
        <Route path="/transferencias" element={<Transferencias />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </Router>
  );
}

export default App;
