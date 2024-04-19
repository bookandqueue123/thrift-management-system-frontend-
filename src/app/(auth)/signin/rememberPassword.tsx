import { cookies } from "next/headers";
import { Dispatch, SetStateAction } from "react";

const rememberPasswordFxn = ({
  initialValues,
  setInitialValues,
  password,
}: {
  password: string,
  initialValues: {
    email: string;
    userCategory: string;
    password: string;
    rememberPassword: boolean;
  };
  setInitialValues: Dispatch<
    SetStateAction<{
      email: string;
      userCategory: string;
      password: string;
      rememberPassword: boolean;
    }>
  >;
}) => {
  const storedPassword = cookies().get("rememberedPassword");
  console.log("storedPassword", storedPassword);
  if (storedPassword) {
    setInitialValues((prevValues: any) => ({
      ...prevValues,
      password: storedPassword as unknown as string,
      rememberPassword: true,
    }));
  }

  if (initialValues.rememberPassword) {
    cookies().set("rememberedPassword", password, { expires: 7 }); // Expires in 7 days
  } else {
    cookies().delete("rememberedPassword");
  }
};

export default rememberPasswordFxn;
