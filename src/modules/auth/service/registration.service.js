import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/errors/error.js";
import { sucessResponseHandling } from "../../../utils/response/sucess.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.js";
import { generateEncrytion } from "../../../utils/security/encrytion.js";
import { verifyToken } from "../../../utils/security/token.js";

export const signup = asyncHandler(async (req, res, next) => {
  const {
    userName,
    email,
    password,
    gender,
    phone,
    confirmationPassword,
    role,
  } = req.body;
  if (password !== confirmationPassword) {
    return next(
      new Error("password mismatch confirmationPassword", { cause: 400 })
    );
  }
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("email exists", { cause: 409 }));
  }
  //  hash
  const hashPassword = generateHash({ plainText: password });
  //  encryption
  const encryptPhone = generateEncrytion({ plainText: phone });
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    gender,
    phone: encryptPhone,
    role,
  });
  emailEvent.emit("sendConfirmEmail", { email });
  return sucessResponseHandling({
    res,
    message: "Signup Successful",
    data: { user },
    status: 201,
  });
});

export const confirmationEmail = asyncHandler(async (req, res, next) => {
  const { code ,email} = req.body;

const user=await userModel.findOne({email})
if (!compareHash({plainText:code,hashValue:user.OTPForConfirmEmail})) {
  return next(new Error("code is not correct"))
}
  await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true ,$unset:{OTPForConfirmEmail:""}},
    { new: true }
  );
  return sucessResponseHandling({
    res,
    message: "confirm email is done",
   
    status: 201,
  });
});
