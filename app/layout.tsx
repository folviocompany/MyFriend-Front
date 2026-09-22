import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "ISP Support Assistant",
  description: "Assistente técnico para analistas de provedores de internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
