"use client";

import CustomerNavbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "../../../store/store";

// export const metadata: Metadata = {
//   title: "Customer | Ajo by Raoatech",
//   description: "Experience the power of seamless savings with Ajo.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRedirect()
  return (
    <html lang="en">
      <body className="bg-ajo_darkBlue ">
        <Provider store={store}>
          <main className="bg-ajo_darkBlue ">
            <CustomerNavbar />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
