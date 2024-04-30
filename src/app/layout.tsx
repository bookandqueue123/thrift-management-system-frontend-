"use client";
import { PreferredUrlProvider } from "@/api/hooks/useUrl";
import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TanstackProvider from "../../providers/TanstackProvider";
import { store } from "../../store/store";
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

      <head></head>

      <body className={montserrat.className}>
        <Provider store={store}>
          <TanstackProvider>
            <PreferredUrlProvider>
              <div className="">
                <ToastContainer />
                {children}
              </div>
            </PreferredUrlProvider>
          </TanstackProvider>
        </Provider>
      </body>
    </html>
  );
}
