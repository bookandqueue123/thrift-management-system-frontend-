
import axios from "axios";
const BASE_URL = "http://13.50.228.186:5000";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDA2YzI4ODZiMzk2Yjc2ZWJiNzM2ZCIsImlhdCI6MTcwODE1ODQwOCwiZXhwIjoxNzA4MjQ0ODA4fQ.aA03kf4_sYzaBGxCgEtHARHlV0FHWu335uuZ3icUQus"

export const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`, // Replace with your actual token
  },
});


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