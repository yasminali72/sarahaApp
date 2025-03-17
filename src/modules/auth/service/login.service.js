import userModel, { providerTypes } from "../../../DB/model/User.model.js";
import { userRoles } from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../../utils/errors/error.js";
import { sucessResponseHandling } from "../../../utils/response/sucess.response.js";
import { compareHash} from "../../../utils/security/hash.js";
import { generateToken} from "../../../utils/security/token.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email,provider: providerTypes.system });
 

  if (!user) {
    return next(new Error("In-valid login data", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please confim your email first", { cause: 400 }));
  }
  const match = compareHash({ plainText: password, hashValue: user.password });
  if (!match) {
    return next(new Error("In-valid login data", { cause: 404 }));
  }
 
  const token = generateToken({
    payload: { id: user._id, isLoggedIn: true },
    signature:
      user.role == userRoles.admin
        ? process.env.TOKEN_SIGNATURE_ADMIN
        : process.env.TOKEN_SIGNATURE,
    options: {
      expiresIn: "5h",
    },
  });
  if (user?.isDeleted) {
    return next(new Error("profile is freezed"))
  }
  return sucessResponseHandling({
    res,
    message: "Login",
    data: { token },
  });
});

// login by google
export const loginWithGoogle = asyncHandler(async (req, res, next) => {
  const {  credential } = req.body;
  if (!credential) {
    return next(new Error("Token is required"));
  }
  const payload = jwt.decode(credential);
console.log(payload);
  if (!payload || !payload.email_verified) {
    return next(new Error("Invalid token or unverified email"));
  }

  let user = await userModel.findOne({ email: payload.email });

  if (!user) {
    user = await userModel.create({
      userName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
    confirmEmail:payload.email_verified,
      image:{ secure_url:payload.picture}, 
      provider: providerTypes.google,
    });
  }

  if (user.isDeleted) {
    return next(new Error("Account is freezed"));
  }

  if (user.provider !== providerTypes.google) {
    return next(new Error("Invalid provider"));
  }

  const token = generateToken({
    payload: { id: user._id, isLoggedIn: true },
    signature:
      user.role === userRoles.admin
        ? process.env.TOKEN_SIGNATURE_ADMIN
        : process.env.TOKEN_SIGNATURE,
    options: {
      expiresIn: "5h",
    },
  });

  return sucessResponseHandling({
    res,
    message: "Login successful",
    data: { token },
  });
});
