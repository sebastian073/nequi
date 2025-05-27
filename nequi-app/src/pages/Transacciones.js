import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransacciones = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error obteniendo usuario:", userError.message);
        return;
      }

      const { data: cuenta, error: cuentaError } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (cuentaError) {
        console.error("No se encontró la cuenta:", cuentaError.message);
        return;
      }

      const { data: trans, error: transError } = await supabase
        .from("transactions")
        .select("*")
        .eq("account_id", cuenta.id)
        .order("created_at", { ascending: false });

      if (transError) {
        console.error("Error obteniendo transacciones:", transError.message);
      } else {
        setTransacciones(trans);
      }

      setLoading(false);
    };

    fetchTransacciones();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Historial de Transacciones</h2>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          backgroundColor: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Volver
      </button>

      {loading ? (
        <p>Cargando transacciones...</p>
      ) : transacciones.length === 0 ? (
        <p>No hay transacciones registradas.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Monto</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((tx) => (
              <tr key={tx.id}>
                <td style={tdStyle}>{tx.transaction_type}</td>
                <td style={tdStyle}>${tx.amount.toLocaleString()}</td>
                <td style={tdStyle}>{new Date(tx.created_at).toLocaleString()}</td>
                <td style={tdStyle}>{tx.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f5f5f5",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "10px",
};
