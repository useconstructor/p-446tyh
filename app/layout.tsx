import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "TaskFlow | Project workspace", description: "A focused workspace for projects, tasks, and team progress." };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
