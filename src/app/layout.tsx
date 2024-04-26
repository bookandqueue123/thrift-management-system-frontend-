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
      <head>
      {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" /> */}
      </head>
      <script
        type="module"
        defer
        src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/spiral.js"
      ></script>
      <body className={montserrat.className}>
        <Provider store={store}>
          <TanstackProvider>
            <PreferredUrlProvider>
              <div className="">
                <ToastContainer />
                {children}
                {/* <script
                  src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"
                  async
                ></script> */}
              </div>
            </PreferredUrlProvider>
          </TanstackProvider>
        </Provider>
      </body>
    </html>
  );
}
