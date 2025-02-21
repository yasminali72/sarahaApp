import joi from "joi";
import { Types } from "mongoose";

export const validationObjectId=(value,helper)=>{
    return Types.ObjectId.isValid(value)?true :helper.message("in-valid objectId")
}
export const generalFields = {
  userName: joi.string().alphanum().min(3).max(20),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 3,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
  confirmationPassword: joi.string().valid(joi.ref("password")),
  phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  gender: joi.string().valid("female", "male"),
  id: joi.string().custom(validationObjectId),
  otp:joi.string()
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = { ...req.body, ...req.params, ...req.query };
    if (req.headers["accept-language"]) {
      inputData["accept-language"] = req.headers["accept-language"];
      console.log(inputData);
    }
    const validationResualt = schema.validate(inputData, { abortEarly: false });
    if (validationResualt.error) {
      return res
        .status(400)
        .json({
          message: "Validation Error",
          validationResualt: validationResualt.error.details,
        });
    }
    return next();
  };
};
export const validation_custom = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    for (const key of Object.keys(schema)) {
      const validationResualt = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResualt.error) {
        validationErrors.push({ key, errors: validationResualt.error.details });
      }
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({
          message: "Validation Error",
          validationResualt: validationErrors,
        });
    }

    return next();
  };
};


