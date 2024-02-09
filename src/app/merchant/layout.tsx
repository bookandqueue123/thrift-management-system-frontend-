import AvatarDropdown from "@/components/Dropdowns";
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
          <section className="w-full px-12 py-6">
            <div className="flex justify-end">
              <AvatarDropdown
                avatarImg="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                routeOptions={["profile", "settings"]}
              />
            </div>
            
          {children}
          </section>
        </main>
      </body>
    </html>
  );
}
