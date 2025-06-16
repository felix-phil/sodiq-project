import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CISSA | Students",
  description: "CISSA Unilorin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
