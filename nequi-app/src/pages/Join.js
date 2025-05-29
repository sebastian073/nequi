import React from "react";
import { Link } from "react-router-dom";

export default function Join() {
  return (
    <div style={styles.container}>
      <div style={styles.logo}>’Nequi</div>

      <div style={styles.buttonGroup}>
        <Link to="/Login" style={styles.button}>Entrar</Link>
        <Link to="/register" style={styles.secondaryButton}>Registrarse</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#2b003b",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#f2e3f7",
    marginBottom: "40px",
  },
  input: {
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "8px",
    width: "250px",
    backgroundColor: "#3c184a",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#ff2d75",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  },
  secondaryButton: {
    backgroundColor: "#53185c",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  },
};
