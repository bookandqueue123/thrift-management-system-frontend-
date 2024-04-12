"use client";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import TanstackProvider from "../../providers/TanstackProvider";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PreferredUrlProvider } from "@/api/hooks/useUrl";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
const montserrat = Montserrat({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Ajo by Raoatech",
//   description: "Experience the power of seamless savings with Ajo.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Provider store={store}>
          <TanstackProvider>
            <PreferredUrlProvider>
              <div className="">
                <ToastContainer />
                {children}
                <script
                  src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"
                  async
                ></script>
              </div>
            </PreferredUrlProvider>
          </TanstackProvider>
        </Provider>
      </body>
    </html>
  );
}
