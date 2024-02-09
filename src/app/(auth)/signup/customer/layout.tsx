
export const metadata = {
  title: "Customer SignUp | Ajo by Raoatech",
  description: "Create your account",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div> {children}</div>;
}
