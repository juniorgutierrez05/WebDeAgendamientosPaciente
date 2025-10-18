"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-lg">Fundación Amigos de los Niños</h1>
      <div className="space-x-4">
        <Link href="/dashboard">Inicio</Link>
        <Link href="/reservas">Reservar Cita</Link>
        <Link href="/historial">Historial</Link>
      </div>
    </nav>
  );
}
