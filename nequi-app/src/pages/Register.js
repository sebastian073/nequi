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

      // Inserta en tabla users
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
      <h2>Registrarse</h2>
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
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "50px" },
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
