"use client";
import useRedirect from "@/api/hooks/useRedirect";
import AvatarDropdown from "@/components/Dropdowns";
import { SuperAdminSidebar } from "@/components/Navbar";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Organization | Ajo by Raoatech",
//   description: "Experience the power of seamless savings with Ajo.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRedirect();
  const [ShowSidebar, setShowSidebar] = useState(false);

  const toggleLeftPadding = () => {
    return ShowSidebar ? "pl-0 md:pl-0" : "pl-4 md:px-12";
  };

  const leftPadding = toggleLeftPadding();
  return (
    <html lang="en">
      <body>
        <main
          className={`w-full px-4 md:px-12 ${leftPadding} min-h-screen bg-ajo_darkBlue`}
        >
          {/* <section> */}
          <SuperAdminSidebar onShow={ShowSidebar} setShow={setShowSidebar} />
          <div className="flex justify-end py-6">
            <AvatarDropdown
              avatarImg="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              routeOptions={["profile", "settings"]}
            />
          </div>

          {children}
          {/* </section> */}
        </main>
      </body>
    </html>
  );
}
