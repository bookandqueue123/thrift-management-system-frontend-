// import { useSelector } from "react-redux";
// import axios from "axios";
// import { selectToken } from '@/slices/OrganizationIdSlice'; // assuming you have a selector defined

// const BASE_URL = "https://thrift.schoolkiatest.com.ng";

// import { useSelector } from "react-redux";
// const token = useSelector(selectToken);
 
// export const client = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Bearer ${token}`, // Replace with your actual token
//   },
// });


import axios from "axios";
import { selectToken } from '@/slices/OrganizationIdSlice'; // assuming you have a selector defined
import { useSelector } from "react-redux";

const BASE_URL = "https://thrift.schoolkiatest.com.ng";

export const useAuth = () => {
  const token = useSelector(selectToken);

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { client };
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







// {
//     "email": "kanmiairs@gmail.com",
//     "phoneNumber": "09054234567",
//     "organisationName": "Blast Saint",
//     "password": "$2b$10$.XIktuoS58/AblNhymDQ2.aQrA1ZeODUK/MozikoRYSmEYknpr8a6",
//     "role": "organisation",
//     "prefferedUrl": "raoatech@ajo.com",
//     "kycVerified": false,
//     "_id": "65d06c2886b396b76ebb736d",
//     "createdAt": "2024-02-17T08:19:52.893Z",
//     "updatedAt": "2024-02-17T08:19:52.893Z",
//     "__v": 0
// }
