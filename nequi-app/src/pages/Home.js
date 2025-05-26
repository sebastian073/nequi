import React from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // redirige al login tras cerrar sesión
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", position: "relative", minHeight: "100vh" }}>
      <h1>Bienvenido a tu cuenta Nequi</h1>
      <p>Gestiona tu dinero de manera eficiente.</p>

      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
