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
    <div style={styles.pageContainer}>
      <div style={styles.topThird}>
        <h2 style={styles.title}>Historial de Transacciones</h2>
      </div>

      <div style={styles.middleThird}>
        <button onClick={() => navigate(-1)} style={styles.whiteButton}>
          Volver
        </button>
      </div>

      <div style={styles.bottomThird}>
        {loading ? (
          <p>Cargando transacciones...</p>
        ) : transacciones.length === 0 ? (
          <p>No hay transacciones registradas.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", maxWidth: "900px" }}>
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
    </div>
  );
}

const thStyle = {
  borderBottom: "2px solid #ccc",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f5f5f5",
  fontSize: "16px",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "12px",
  fontSize: "15px",
};

// Estilos reutilizados de la pantalla anterior
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
    flex: 2,
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    overflowY: "auto",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
  },
  whiteButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "2px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#000",
    cursor: "pointer",
  },
};
