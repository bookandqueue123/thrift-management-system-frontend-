export async function getServerSideProps(context: { req: { cookies: { rememberedPassword: any; }; }; }) {
  // Fetching the stored password from the cookies
  const storedPassword = context.req.cookies.rememberedPassword;

  // Returning the stored password as a prop to the SignInForm component
  return {
    props: {
      storedPassword,
    },
  };
}
