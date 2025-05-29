import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Transferencias() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState("");
  const [telefonoDestino, setTelefonoDestino] = useState("");
  const [cuentaOrigen, setCuentaOrigen] = useState(null);
  const [telefonoOrigen, setTelefonoOrigen] = useState("");

  useEffect(() => {
    const obtenerCuenta = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error al obtener usuario:", error.message);
        return;
      }

      const { data: datosUsuario, error: errorUsuario } = await supabase
        .from("users")
        .select("id, phone_number")
        .eq("id", user.id)
        .single();

      if (errorUsuario) {
        console.error("Error al obtener el teléfono del usuario:", errorUsuario.message);
        return;
      }

      setTelefonoOrigen(datosUsuario.phone_number);

      const { data: cuenta, error: cuentaError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (cuentaError) {
        console.error("No se encontró la cuenta del usuario:", cuentaError.message);
      } else {
        setCuentaOrigen(cuenta);
      }
    };

    obtenerCuenta();
  }, []);

  const realizarTransferencia = async () => {
    if (!monto || !telefonoDestino) {
      alert("Completa todos los campos");
      return;
    }

    if (parseFloat(monto) <= 0) {
      alert("El monto debe ser mayor que cero");
      return;
    }

    if (parseFloat(monto) > cuentaOrigen.balance) {
      alert("Fondos insuficientes");
      return;
    }

    if (telefonoDestino === telefonoOrigen) {
      alert("No puedes transferirte a ti mismo.");
      return;
    }

    const { data: userDestino, error: errorUserDestino } = await supabase
      .from("users")
      .select("id, phone_number")
      .eq("phone_number", telefonoDestino)
      .single();

    if (errorUserDestino || !userDestino) {
      alert("Usuario destino no encontrado");
      return;
    }

    const { data: cuentaDestino, error: errorCuentaDestino } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userDestino.id)
      .single();

    if (errorCuentaDestino || !cuentaDestino) {
      alert("Cuenta destino no encontrada");
      return;
    }

    const nuevoSaldoOrigen = cuentaOrigen.balance - parseFloat(monto);
    const nuevoSaldoDestino = cuentaDestino.balance + parseFloat(monto);

    const { error: errorUpdateOrigen } = await supabase
      .from("accounts")
      .update({ balance: nuevoSaldoOrigen })
      .eq("id", cuentaOrigen.id);

    const { error: errorUpdateDestino } = await supabase
      .from("accounts")
      .update({ balance: nuevoSaldoDestino })
      .eq("id", cuentaDestino.id);

    if (errorUpdateOrigen || errorUpdateDestino) {
      alert("Error al transferir fondos");
      console.error(errorUpdateOrigen || errorUpdateDestino);
      return;
    }

    const { error: errorInsert } = await supabase.from("transactions").insert([
      {
        account_id: cuentaOrigen.id,
        amount: parseFloat(monto),
        transaction_type: "transfer_out",
        description: `Enviado a ${telefonoDestino}`,
      },
      {
        account_id: cuentaDestino.id,
        amount: parseFloat(monto),
        transaction_type: "transfer_in",
        description: `Recibido de ${telefonoOrigen}`,
      },
    ]);

    if (errorInsert) {
      alert("Fondos transferidos, pero no se pudo registrar la transacción.");
      console.error(errorInsert);
    } else {
      alert("Transferencia realizada con éxito y registrada.");
    }

    navigate("/home");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.topThird}>
        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>Transferir dinero</h2>
      </div>

      <div style={styles.middleThird}>
        <input
          type="text"
          placeholder="Número de teléfono del destinatario"
          value={telefonoDestino}
          onChange={(e) => setTelefonoDestino(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Monto a transferir"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={styles.input}
        />
        <button style={styles.createAccountButton} onClick={realizarTransferencia}>
          Enviar plata
        </button>
      </div>

      <div style={styles.bottomThird}>
        <button style={styles.whiteButton} onClick={() => navigate("/home")}>
          Volver
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', Arial, sans-serif",
  },
  topThird: {
    flex: 1,
    backgroundColor: "#2b003b",
    color: "#f2e3f7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  middleThird: {
    flex: 1,
    backgroundColor: "#ff2d75",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomThird: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  input: {
    padding: "14px",
    width: "100%",
    maxWidth: "320px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  createAccountButton: {
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#b6e86b",
    color: "#000",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,102,204,0.7)",
    marginTop: "20px",
  },
  whiteButton: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "2px solid #ccc",
    backgroundColor: "#e8d5f7",
    color: "#000",
    cursor: "pointer",
  },
};