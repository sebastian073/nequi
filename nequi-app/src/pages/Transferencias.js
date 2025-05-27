import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Transferencias() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState("");
  const [telefonoDestino, setTelefonoDestino] = useState("");
  const [cuentaOrigen, setCuentaOrigen] = useState(null);

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

    // Buscar cuenta destino por teléfono
    const { data: cuentaDestino, error: errorDestino } = await supabase
      .from("accounts")
      .select("*")
      .eq("telefono", telefonoDestino)
      .single();

    if (errorDestino || !cuentaDestino) {
      alert("Cuenta destino no encontrada con ese número de teléfono.");
      return;
    }

    if (cuentaOrigen.telefono === cuentaDestino.telefono) {
      alert("No puedes transferirte a ti mismo.");
      return;
    }

    // Calcular nuevos saldos
    const nuevoSaldoOrigen = cuentaOrigen.balance - parseFloat(monto);
    const nuevoSaldoDestino = cuentaDestino.balance + parseFloat(monto);

    // Actualizar cuenta origen
    const { error: errorUpdateOrigen } = await supabase
      .from("accounts")
      .update({ balance: nuevoSaldoOrigen })
      .eq("user_id", cuentaOrigen.user_id);

    // Actualizar cuenta destino
    const { error: errorUpdateDestino } = await supabase
      .from("accounts")
      .update({ balance: nuevoSaldoDestino })
      .eq("user_id", cuentaDestino.user_id);

    if (errorUpdateOrigen || errorUpdateDestino) {
      alert("Error al transferir fondos");
      console.error(errorUpdateOrigen || errorUpdateDestino);
    } else {
      // Registrar transacción en historial
      const { error: errorInsertTransaccion } = await supabase
        .from("transactions")
        .insert([
          {
            telefono_origen: cuentaOrigen.telefono,
            telefono_destino: cuentaDestino.telefono,
            monto: parseFloat(monto),
          },
        ]);

      if (errorInsertTransaccion) {
        alert("Transferencia realizada, pero no se pudo registrar el historial.");
        console.error(errorInsertTransaccion);
      } else {
        alert("Transferencia realizada con éxito y registrada.");
      }

      navigate("/home");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Transferir dinero</h2>

      <div style={{ margin: "20px" }}>
        <input
          type="text"
          placeholder="Número de teléfono del destinatario"
          value={telefonoDestino}
          onChange={(e) => setTelefonoDestino(e.target.value)}
          style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
        />
        <br />
        <input
          type="number"
          placeholder="Monto a transferir"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
      </div>

      <button
        onClick={realizarTransferencia}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0080ff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Enviar dinero
      </button>

      <br />
      <button
        onClick={() => navigate("/home")}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          backgroundColor: "#ccc",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Volver
      </button>
    </div>
  );
}
