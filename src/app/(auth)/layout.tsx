import Banner from "@/components/Banner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="md:flex md:h-screen md:items-center">
          <Banner />
          {children}
        </main>
      </body>
    </html>
  );
}
