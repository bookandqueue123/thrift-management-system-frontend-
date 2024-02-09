import { Sidebar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer | Ajo by Raoatech",
  description: "Experience the power of seamless savings with Ajo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex bg-ajo_darkBlue">
          <Sidebar />
          {children}
        </main>
      </body>
    </html>
  );
}
