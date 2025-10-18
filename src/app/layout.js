import "./globals.css";

export const metadata = {
  title: "Portal del Paciente",
  description: "Sistema de agendamiento médico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
