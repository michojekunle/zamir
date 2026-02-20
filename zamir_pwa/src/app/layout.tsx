import "./globals.css";
import { Metadata } from "next";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "Zamir - The Word in Melody",
  description:
    "Experience the Word of God like never before. Stream Bible verses transformed into ambient melodies.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0F1B2E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
