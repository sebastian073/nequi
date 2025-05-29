import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!fullName) {
      alert("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!phoneNumber) {
      alert("Por favor ingresa tu número de teléfono.");
      return;
    }
    if (!email) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const { error: insertError } = await supabase
        .from("users")
        .insert([{ id: data.user.id, email, full_name: fullName, phone_number: phoneNumber }]);

      if (insertError) throw insertError;

      alert("Registro exitoso.");
      setFullName("");
      setEmail("");
      setPassword("");
      navigate("/Login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>’Nequi</div>

      <input
        type="text"
        placeholder="Nombre completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={styles.input}
        disabled={loading}
      />
      <input
        type="tel"
        placeholder="Número de teléfono"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={styles.input}
        disabled={loading}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        disabled={loading}
      />

      <button onClick={handleRegister} style={styles.button} disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      <button onClick={() => navigate("/")} style={styles.secondaryButton}>
        Volver
      </button>
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
  button: {
    backgroundColor: "#ff2d75",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  secondaryButton: {
    backgroundColor: "#ffffff10",
    color: "#f2e3f7",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #f2e3f7",
    fontWeight: "normal",
    fontSize: "14px",
    marginTop: "10px",
    cursor: "pointer",
  },
};
