import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener la cuenta del usuario actual
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

      console.log("ID del usuario autenticado:", user.id);

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

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // redirige al login
  };

  // Crear cuenta si no existe
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
    <div style={{ textAlign: "center", marginTop: "50px", position: "relative", minHeight: "100vh" }}>
      <h1>Bienvenido a tu cuenta Nequi</h1>
      <p>Gestiona tu dinero de manera eficiente.</p>

      {!loading && account ? (
        <div>
          <h3>Tipo de cuenta: {account.account_type}</h3>
          <h3>Saldo actual: ${account.balance.toLocaleString()}</h3>

          <button
            onClick={() => navigate("/transacciones")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Ver transacciones
          </button>

          <button
            onClick={() => navigate("/transferencias")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#8000ff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Transferir dinero
          </button>

        </div>
      ) : (
        !loading && (
          <button
            onClick={crearCuenta}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#0066cc",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Crear cuenta
          </button>
        )
      )}

      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
