import { clearAuthData, selectToken } from "@/slices/OrganizationIdSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// const apiUrl = process.env.BACKEND_API;
 const apiUrl = 'http://localhost:4000/'
// console.log(apiUrl);

 const BASE_URL = apiUrl;

export const useAuth = () => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const router = useRouter();

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  async function SignOut() {
    console.log("signed out");
    dispatch(clearAuthData());
    router.replace("/signin");
  }
  return { client, SignOut };
};

// export const client = axios.create({
//   baseURL: BASE_URL,
// });

// export const setAuthToken = (token: string) => {
//   if (token) {
//     client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete client.defaults.headers.common["Authorization"];
//   }
// };

// export const ConfigureClient = () => {
//   const token = useSelector(selectToken);
//   setAuthToken(token);
//   console.log(token)
// };
