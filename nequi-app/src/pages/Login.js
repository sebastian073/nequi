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
    <div style={styles.container}>
      <h2>Iniciar Sesión</h2>
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
        Ingresar
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "80%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    color: "#fff",
    backgroundColor: "#00bfa5",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
