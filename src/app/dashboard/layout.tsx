import { Metadata } from "next";
import React from "react";
import DashboardLayout from "./DashboardLayout";

export const metadata: Metadata = {
  title: "CISSA Unilorin",
  description: "Auto Scheduling",
};

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
