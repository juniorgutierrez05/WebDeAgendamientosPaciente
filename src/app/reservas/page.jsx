"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function ReservasPage() {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [doctor, setDoctor] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const ultimaCita = new Date("2025-10-10");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Traer solo nombres de médicos
    axios.get("http://localhost:8000/medicos/nombres", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setMedicos(res.data))
      .catch(err => console.error(err));

    // Traer especialidades
    axios.get("http://localhost:8000/medicos/especialidades", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setEspecialidades(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => setImagenes([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha) return setMensaje("Selecciona una fecha válida.");
    const diferenciaDias = (fecha - ultimaCita) / (1000 * 60 * 60 * 24);
    if (diferenciaDias < 15) return setMensaje("Debe haber al menos 15 días entre citas.");

    const formData = new FormData();
    formData.append("fecha", fecha.toISOString().split("T")[0]);
    formData.append("hora", hora);
    formData.append("doctor", doctor);
    formData.append("especialidad", especialidad);
    imagenes.forEach(img => formData.append("imagenes", img));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/citas/crear", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      setMensaje("✅ Tu cita fue registrada y está pendiente de aprobación.");
    } catch (error) {
      setMensaje("❌ Error al enviar la solicitud.");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-130 mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4 text-center">
          Reserva de Cita Médica
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Fecha:</label>
            <DatePicker
              selected={fecha}
              onChange={setFecha}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="border border-blue-700 p-2 rounded-full w-full"
            />
          </div>

          <div>
            <label>Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={e => setHora(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-full w-full"
            />
          </div>

          <div>
            <label>Medico:</label>
            <select
              value={doctor}
              onChange={e => setDoctor(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-full w-full"
            >
              <option value="">Selecciona un médico</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Especialidad:</label>
            <select
              value={especialidad}
              onChange={e => setEspecialidad(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-full w-full"
            >
              <option value="">Selecciona una especialidad</option>
              {especialidades.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Imágenes (mínimo 1):</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-blue-700 p-2 rounded-full"
            />
          </div>

          <button type="submit" className="block mx-auto bg-green-600 text-white w-50 py-2 rounded-full hover:bg-green-700">
            Reservar Cita
          </button>

          {mensaje && (
            <p className={`text-center mt-3 font-medium ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
