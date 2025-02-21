

import CryptoJs from "crypto-js"

export const generateEncrytion=({plainText="",signature=process.env.ENCRYPTION_SIGNATURE}={})=>{
const encryption=CryptoJs.AES.encrypt(plainText,signature).toString()
return encryption
}

export const generateDecrytion=({cipherText="",signature=process.env.ENCRYPTION_SIGNATURE}={})=>{
    const decoded=CryptoJs.AES.decrypt(cipherText,signature).toString(CryptoJs.enc.Utf8)
    return decoded
    }