import React from "react";
import { Link } from "react-router-dom";

export default function Join() {
  return (
    <div style={styles.container}>
      <h1>Bienvenido a Nequi</h1>
      <p>Gestiona tu dinero fácilmente.</p>
      <div>
        <Link to="/login" style={styles.button}>Iniciar Sesión</Link>
        <Link to="/register" style={styles.button}>Registrarse</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    display: "inline-block",
    margin: "10px",
    padding: "10px 20px",
    color: "#fff",
    backgroundColor: "#00bfa5",
    textDecoration: "none",
    borderRadius: "5px",
  },
};
