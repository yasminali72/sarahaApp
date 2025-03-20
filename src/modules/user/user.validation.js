import joi from 'joi'
import { generalFields, validationObjectId } from '../../middleware/validation.middleware.js'


export const updateProfile=joi.object().keys({
    userName:generalFields.userName,
    gender:generalFields.gender,
    DOB:joi.date().less("now"),
    email:generalFields.email
}).required()

export const updatePassword=joi.object().keys({
   oldPassword:generalFields.password.required(),
   newPassword:generalFields.password.not(joi.ref("oldPassword")).required(),
   confirmationPassword:generalFields.confirmationPassword.valid(joi.ref("newPassword")).required()
}).required()

export const updatePhone=joi.object().keys({
   newPhone:generalFields.phone.required()
 }).required()


 export const unFreezeProfile=joi.object().keys({
    email:generalFields.email.required()
  }).required()
 export const reActiveProfile=joi.object().keys({
    email:generalFields.email.required(),
    otp:generalFields.otp.required()
  }).required()

  export const shareProfile=joi.object().keys({
    userId:generalFields.id.required()
  }).required()


export const forgetPassword=joi.object().keys({
  email:generalFields.email.required()
}).required()

export const verifyCode=joi.object().keys({
 otp:generalFields.otp.required(),
 email:generalFields.email.required()
}).required()

export const resetPassword=joi.object().keys({
  email:generalFields.email.required()
  ,newPassword:generalFields.password.required(),confirmationPassword:generalFields.confirmationPassword.valid(joi.ref("newPassword")).required()
 }).required()
