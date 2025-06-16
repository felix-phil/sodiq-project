import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CISSA Unilorin",
  description: "Auto Scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${instrumentSans.variable} antialiased`}>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
