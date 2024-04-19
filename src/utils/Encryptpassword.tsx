import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";


export const encryptPassword = (password: string, secretKey: string) => {
  return AES.encrypt(password, secretKey).toString()
}

export const decryptPassword = (encryptedPassword: string, secretKey: string) => {
  const bytes = AES.decrypt(encryptedPassword, secretKey)
  return bytes.toString(Utf8)
}