"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }

    // Marcamos que ya revisó el token
    setChecking(false);
  }, [router]);

  // 🔒 Mientras verifica el token, no renderiza nada
  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    );
  }

  // 🔑 Si no está autenticado, no muestra el contenido
  if (!isAuthenticated) return null;

  // ✅ Si hay token, muestra el contenido
  return <>{children}</>;
}
