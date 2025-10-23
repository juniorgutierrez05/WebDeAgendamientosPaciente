"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function HistorialPage() {
  const [historial, setHistorial] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState(null);
  const [filtroFin, setFiltroFin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Formatea la fecha a yyyy-MM-dd
  const formatDate = (date) => {
    if (!date) return undefined;
    return date.toISOString().split("T")[0];
  };

  const fetchHistoriales = async (inicio, fin) => {
    setLoading(true);
    setError(null);

    // Revisar que estamos en el cliente
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    let url = "http://localhost:8000/api/historiales";
    if (inicio || fin) {
      const params = new URLSearchParams();
      if (inicio) params.append("fecha_inicio", inicio);
      if (fin) params.append("fecha_fin", fin);
      url = `http://localhost:8000/api/historiales/buscar?${params.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Si el servidor devuelve 401 o 403, redirige al login
      if (response.status === 401 || response.status === 403) {
        router.push("/login");
        return;
      }

      const text = await response.text(); // leer como texto primero
      let data;
      try {
        data = JSON.parse(text); // intentar parsear JSON
      } catch {
        console.error("Respuesta no es JSON:", text);
        setError("Error al obtener historiales. Respuesta inesperada del servidor.");
        setHistorial([]);
        return;
      }

      setHistorial(data.historial || []);
    } catch (err) {
      console.error("Error fetching historial:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoriales();
  }, []);

  const filtrar = () => {
    const inicio = formatDate(filtroInicio);
    const fin = formatDate(filtroFin);
    fetchHistoriales(inicio, fin);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-semibold text-yellow-600 mb-6">Historial Médico</h2>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Desde:</label>
            <DatePicker
              selected={filtroInicio}
              onChange={(date) => setFiltroInicio(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-blue-700 p-2 rounded-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Hasta:</label>
            <DatePicker
              selected={filtroFin}
              onChange={(date) => setFiltroFin(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-blue-700 p-2 rounded-full"
            />
          </div>
          <button
            onClick={filtrar}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition mt-2 md:mt-6"
          >
            Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Cargando historiales...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : historial.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-blue-200">
                <tr>
                  <th className="border px-3 py-2 text-left">Fecha</th>
                  <th className="border px-3 py-2 text-left">Hora</th>
                  <th className="border px-3 py-2 text-left">Médico</th>
                  <th className="border px-3 py-2 text-left">Especialidad</th>
                  <th className="border px-3 py-2 text-left">Sistema</th>
                  <th className="border px-3 py-2 text-left">Diagnóstico</th>
                  <th className="border px-3 py-2 text-left">Recomendaciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-3 py-2">{item.fecha || "N/A"}</td>
                    <td className="border px-3 py-2">{item.hora_cita || "N/A"}</td>
                    <td className="border px-3 py-2">{item.medico || "N/A"}</td>
                    <td className="border px-3 py-2">{item.especialidad || "N/A"}</td>
                    <td className="border px-3 py-2">{item.sistema || "N/A"}</td>
                    <td className="border px-3 py-2">{item.diagnostico || "N/A"}</td>
                    <td className="border px-3 py-2">{item.recomendaciones || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No se encontraron registros en el rango seleccionado.
          </p>
        )}
      </div>
      <ChatWidget />
    </div>
  );
}
