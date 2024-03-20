import Banner from "@/components/Banner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( <div className="md:flex">

    <Banner/>
    {children}
  </div>
    // <html lang="en">
    //   <body>
    //     <main className="md:flex">
    //       <Banner />
         
    //     </main>
    //   </body>
    // </html>
  );
}
