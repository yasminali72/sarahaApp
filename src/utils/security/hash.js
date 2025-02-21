
import bcrypt from "bcryptjs";



export const generateHash=({plainText="",salt=process.env.SALT}={})=>{
const hash=bcrypt.hashSync(plainText,parseInt(salt))
return hash
}

export const compareHash=({plainText="",hashValue=""}={})=>{
    const hash=bcrypt.compareSync(plainText,hashValue)
    return hash
    }