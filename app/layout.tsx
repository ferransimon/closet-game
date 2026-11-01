import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Armario",
  description: "Ordena la colada: ropa de hombre a la izquierda, de mujer a la derecha. ¡Rápido!",
  applicationName: "Armario",
  appleWebApp: { capable: true, title: "Armario", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#fff8f0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} antialiased`}>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
