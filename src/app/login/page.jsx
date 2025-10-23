"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Error al iniciar sesión");
        return;
      }

      const data = await response.json();

      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirigir al dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo.jpeg')" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96"
      >
        <Image
          src="/logo.png"
          alt="Logo Fundación"
          width={130}
          height={120}
          className="mb-4 items-center mx-auto"
          priority
        />
        <h2 className="text-2xl font-semibold text-center mb-6 text-red-500">
          Bienvenido
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="bg-yellow-600 text-white w-40 block mx-auto py-2 rounded-full hover:bg-yellow-700 transition font-semibold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
