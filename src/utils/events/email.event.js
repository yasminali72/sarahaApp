import { EventEmitter } from "node:events";
import { confirmEmail } from "../email/template/confirm.email.js";
import { sendEmail } from "../email/send.email.js";
import { generateToken } from "../security/token.js";
import { customAlphabet } from "nanoid";
import userModel from "../../DB/model/User.model.js";
import { generateHash } from "../security/hash.js";
import { reActiveProfile } from "../email/template/reActiveProfile.js";
import { asyncHandler } from "../errors/error.js";
export const emailEvent=new EventEmitter()
emailEvent.on("sendConfirmEmail",async({email}={})=>{
    const emailToken=generateToken({payload:email,signature:process.env.EMAIL_TOKEN_SIGNATURE})
    console.log(emailToken,'token');
    const emailLink=`/confirm-email/${emailToken}`
    const html=confirmEmail({emailLink})
    await sendEmail({to:email,subject:"confirm Email",html})
})

emailEvent.on("emailForActiveProfile",async({email}={})=>{
  const otp=customAlphabet("0123456789",4)()
  const hashOtp=generateHash({plainText:otp})
  const html=reActiveProfile({code:otp})
  await userModel.updateOne({email},{reActiveProfileOTP:hashOtp})

  await sendEmail({to:email,subject:"Re-active Profile",html})

 

})

