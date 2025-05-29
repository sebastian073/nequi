import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Configuracion() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError("Error obteniendo usuario: " + userError.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name, phone_number, email")
        .eq("id", user.id)
        .single();

      if (error) {
        setError("Error obteniendo datos del usuario: " + error.message);
      } else if (data) {
        setUserData({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError("Error obteniendo usuario: " + userError.message);
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        email: userData.email,
      })
      .eq("id", user.id);

    if (error) {
      setError("Error al actualizar datos: " + error.message);
    } else {
      alert("Datos actualizados correctamente");
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar tu cuenta? Esto eliminará todos tus datos y no podrá revertirse."
    );
    if (!confirm) return;

    setSaving(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError("Error obteniendo usuario: " + userError.message);
      setSaving(false);
      return;
    }

    try {
      // Eliminar transacciones y cuentas, luego usuario
      const { data: accountsData, error: errorAccounts } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", user.id);

      if (errorAccounts) throw errorAccounts;

      const accountIds = accountsData.map((acc) => acc.id);

      if (accountIds.length > 0) {
        const { error: errDelTrans } = await supabase
          .from("transactions")
          .delete()
          .in("account_id", accountIds);

        if (errDelTrans) throw errDelTrans;
      }

      const { error: errorDeleteAccounts } = await supabase
        .from("accounts")
        .delete()
        .eq("user_id", user.id);

      if (errorDeleteAccounts) throw errorDeleteAccounts;

      const { error: errorDeleteUser } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (errorDeleteUser) throw errorDeleteUser;

      // Nota: supabase.auth.admin.deleteUser requiere permisos especiales
      const { error: errorDeleteAuth } = await supabase.auth.admin.deleteUser(user.id);
      if (errorDeleteAuth) {
        console.warn("No se pudo eliminar usuario en auth, haz logout.");
      }

      alert("Cuenta eliminada correctamente. Serás redirigido al inicio.");
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      setError("Error al eliminar cuenta: " + error.message);
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div style={styles.pageContainer}>
        <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando datos...</p>
      </div>
    );

  return (
    <div style={styles.pageContainer}>
      {/* Botón de configuración arriba a la derecha */}
      <div style={styles.settingsButtonContainer}>
        <button onClick={() => navigate("/Home")} style={styles.settingsButton}>
          ←
        </button>
      </div>

      {/* Primer tercio */}
      <div style={styles.topThird}>
        <h2 style={styles.title}>Configuración de Perfil</h2>
        {error && <p style={{ color: "#ff4d4d", fontWeight: "600" }}>{error}</p>}
      </div>

      {/* Segundo tercio */}
      <div style={styles.middleThird}>
        <label style={styles.label}>
          Nombre completo:
          <input
            type="text"
            name="full_name"
            value={userData.full_name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Número telefónico:
          <input
            type="text"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Tercer tercio */}
      <div style={styles.bottomThird}>
        <button onClick={handleDeleteAccount} disabled={saving} style={styles.deleteButton}>
          {saving ? "Procesando..." : "Eliminar mi cuenta"}
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
    position: "relative",
    fontFamily: "'Poppins', Arial, sans-serif",
  },
  settingsButtonContainer: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 10,
  },
  settingsButton: {
    padding: "8px 12px",
    fontSize: "20px",
    backgroundColor: "#ffffff",
    border: "2px solid #ccc",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  topThird: {
    flex: 1,
    backgroundColor: "#2b003b", // morado oscuro
    display: "flex",
    justifyContent: "center", // horizontal center
    alignItems: "center", // vertical center
    textAlign: "center",
    padding: "20px",
    borderRadius: "0 0 0 0", // sin borde redondeado para fondo completo
    color: "#f2e3f7",
    flexDirection: "column",
  },
  middleThird: {
    flex: 2,
    backgroundColor: "#ff2d75", // rosa fuerte
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "15px",
    padding: "20px",
    color: "#fff",
  },
  bottomThird: {
    flex: 1,
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0",
  },
  label: {
    fontWeight: "600",
    fontSize: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "280px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
  },
  saveButton: {
    marginTop: "10px",
    padding: "14px",
    backgroundColor: "#5bc0de", // azul claro (similar a bootstrap info)
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(91,192,222,0.7)",
  },
  deleteButton: {
    padding: "14px 24px",
    backgroundColor: "#d9534f", // rojo más suave (bootstrap danger)
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(217,83,79,0.7)",
  },
};