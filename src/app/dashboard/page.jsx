"use client";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserMd, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [paciente, setPaciente] = useState(null);
  const [proximaCita, setProximaCita] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/pacientes/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener los datos");
        }

        const data = await res.json();

        // Mapear los datos de la API al estado
        setPaciente({
          nombre: data.usuario.nombre,
          tipo: data.usuario.tipo,
          ubicacion: data.usuario.ubicacion,
          enfermedades: data.medica.enfermedades,
          peso: data.medica.peso,
          talla: data.medica.talla,
        });

        setProximaCita(data.proxima_cita || null);

      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    fetchDashboard();
  }, [router]);

  if (!paciente) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
            Bienvenido, {paciente.nombre} 👋
          </h2>

          {/* Información personal y médica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-200 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Información Personal
              </h3>
              <p><strong>Ubicación:</strong> {paciente.ubicacion}</p>
              <p><strong>Tipo de Paciente:</strong> {paciente.tipo}</p>
            </div>

            <div className="bg-red-200 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Información Médica
              </h3>
              <p><strong>Enfermedades:</strong> {paciente.enfermedades}</p>
              <p><strong>Peso:</strong> {paciente.peso}</p>
              <p><strong>Talla:</strong> {paciente.talla}</p>
            </div>
          </div>

          {/* Próxima cita */}
          <div className="bg-green-200 p-6 rounded-xl shadow-md mt-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Próxima Cita
            </h3>
            {proximaCita ? (
              <div>
                <p><strong>Fecha:</strong> {proximaCita.fecha}</p>
                <p><strong>Hora:</strong> {proximaCita.hora}</p>
                <p><strong>Doctor:</strong> {proximaCita.doctor}</p>
                <p><strong>Especialidad:</strong> {proximaCita.especialidad}</p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`font-medium ${
                      proximaCita.estado.includes("Pendiente")
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {proximaCita.estado}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                No tienes citas agendadas. Reserva una para comenzar.
              </p>
            )}
          </div>

          {/* Enlaces rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Link
              href="/reservas"
              className="flex flex-col items-center justify-center bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700 transition"
            >
              <FaUserMd size={30} className="mb-2" />
              <span>Reservar Cita</span>
            </Link>

            <Link
              href="/historial"
              className="flex flex-col items-center justify-center bg-green-600 text-white p-6 rounded-xl shadow hover:bg-green-700 transition"
            >
              <FaHistory size={30} className="mb-2" />
              <span>Ver Historial</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center bg-red-500 text-white p-6 rounded-xl shadow hover:bg-red-600 transition"
            >
              <FaSignOutAlt size={30} className="mb-2" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Chat flotante */}
        <ChatWidget />
      </div>
    </ProtectedRoute>
  );
}
