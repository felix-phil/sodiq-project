import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CISSA | Schedule",
  description: "CISSA Unilorin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
