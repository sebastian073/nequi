import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";  

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      alert("Inicio de sesión exitoso");
      navigate("/Home");  
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Entra
        </button>

        <button 
          onClick={() => navigate("/")} 
          style={styles.secondaryButton}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#2b003b",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    color: "#f2e3f7",
    fontFamily: "'Poppins', Arial, sans-serif",
    textAlign: "center",
  },
  container: {
    width: "100%",
    maxWidth: "360px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "30px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    margin: "12px 0",
    borderRadius: "12px",
    border: "2px solid #6a3d7a",
    backgroundColor: "#431a63",
    color: "#f2e3f7",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    marginTop: "28px",
    width: "100%",
    padding: "14px 0",
    borderRadius: "14px",
    backgroundColor: "#ff2d75",
    border: "none",
    fontWeight: "700",
    fontSize: "18px",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 5px 20px rgba(255, 45, 117, 0.7)",
    transition: "background-color 0.3s ease",
  },
  secondaryButton: {
    marginTop: "16px",
    width: "100%",
    padding: "12px 0",
    borderRadius: "14px",
    backgroundColor: "#ffffff10",
    border: "1px solid #f2e3f7",
    color: "#f2e3f7",
    fontWeight: "500",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};
