import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signup = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email
      .required(),
    password: generalFields.password
      .required(),
    confirmationPassword: generalFields.confirmationPassword.valid(joi.ref("password")).required(),
    phone:generalFields.phone
      .required(),
    gender: generalFields.gender.required(),

   
  })
  .required()
  .options({ allowUnknown: false });








  
export const signup_costum = {
  body: joi
    .object()
    .keys({
      userName: joi.string().alphanum().min(3).max(20).required(),
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          maxDomainSegments: 3,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      confirmationPassword: joi.string().valid(joi.ref("password")).required(),
      phone: joi
        .string()
        .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
        .required(),
      gender: joi.string().valid("female", "male").required(),
    })
    .required()
    .options({ allowUnknown: false }),

  params: joi
    .object()
    .keys({
      id: joi.boolean().required(),
    })
    .required()
    .options({ allowUnknown: false }),
  headers: joi
    .object()
    .keys({
      "accept-Languages": joi.string().valid("en", "ar"),
    })
    .required()
    .options({ allowUnknown: true }),
};

export const login = joi
  .object()
  .keys({
    email: generalFields.email
      .required(),
    password: generalFields.password
      .required(),
   
  })
  .required()
  .options({ allowUnknown: false });
