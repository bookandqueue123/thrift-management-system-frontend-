"use client";
import { PreferredUrlProvider } from "@/api/hooks/useUrl";
import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TanstackProvider from "../../providers/TanstackProvider";
import { store } from "../../store/store";
import { PermissionsProvider } from "@/api/hooks/usePermissions";
import Script from "next/script";
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
    <html lang="en" suppressHydrationWarning>
      <head>
      
      </head>

      <body className={montserrat.className}>
        <Provider store={store}>
          <TanstackProvider>
            <PreferredUrlProvider>
              <PermissionsProvider>
                <div className="">
                  <ToastContainer />
                  <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.5.1/flowbite.min.js"></Script>
                  {children}
                </div>
              </PermissionsProvider>
            </PreferredUrlProvider>
          </TanstackProvider>
        </Provider>
      </body>
    </html>
  );
}
