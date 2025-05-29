import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error obteniendo usuario:", userError.message);
        return;
      }

      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.warn("No se encontró cuenta para el usuario:", error.message);
      } else {
        setAccount(data);
      }

      setLoading(false);
    };

    fetchAccount();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const crearCuenta = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error obteniendo usuario:", userError.message);
      return;
    }

    const { error: insertError } = await supabase.from("accounts").insert([
      {
        user_id: user.id,
        account_type: "Ahorros",
        balance: 50000,
      },
    ]);

    if (insertError) {
      console.error("Error al crear cuenta:", insertError.message);
    } else {
      alert("Cuenta creada exitosamente. Recarga para ver los datos.");
      window.location.reload();
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Botón de configuración arriba a la derecha */}
      <div style={styles.settingsButtonContainer}>
        <button onClick={() => navigate("/configuracion")} style={styles.settingsButton}>
          ⚙️
        </button>
      </div>

      {/* Primer tercio */}
      <div style={styles.topThird}>
        <h1 style={styles.title}>Bienvenido a tu cuenta Nequi</h1>
        <p style={styles.subtitle}>Gestiona tu dinero de manera eficiente.</p>
      </div>

      {/* Segundo tercio */}
      <div style={styles.middleThird}>
        {!loading && account ? (
          <>
            <h3 style={styles.infoText}>Tipo de cuenta: {account.account_type}</h3>
            <h3 style={styles.infoText}>Saldo actual: ${account.balance.toLocaleString()}</h3>
          </>
        ) : (
          !loading && (
            <button onClick={crearCuenta} style={styles.createAccountButton}>
              Crear cuenta
            </button>
          )
        )}
      </div>

      {/* Tercer tercio */}
      <div style={styles.bottomThird}>
        <div style={styles.menuBox}>
          {!loading && account && (
            <>
              <button onClick={() => navigate("/transacciones")} style={styles.whiteButton}>
                Movimientos
              </button>
              <button onClick={() => navigate("/transferencias")} style={styles.whiteButton}>
                Enviar
              </button>
            </>
          )}
          <button onClick={handleLogout} style={styles.redButton}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    fontFamily: "'Poppins', Arial, sans-serif",
  },
  settingsButtonContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
  },
  settingsButton: {
    padding: "8px 12px",
    fontSize: "18px",
    backgroundColor: "#ffffff",
    border: "2px solid #ccc",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
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
  menuBox: {
    backgroundColor: "#e8d5f7",
    padding: "20px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: "10px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "18px",
  },
  infoText: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "8px 0",
  },
  createAccountButton: {
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#0066cc",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,102,204,0.7)",
  },
  whiteButton: {
    flex: 1,
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "2px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#000",
    cursor: "pointer",
  },
  redButton: {
    flex: 1,
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    cursor: "pointer",
  },
};
