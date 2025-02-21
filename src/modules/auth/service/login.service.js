import userModel from "../../../DB/model/User.model.js";
import { userRoles } from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../../utils/errors/error.js";
import { sucessResponseHandling } from "../../../utils/response/sucess.response.js";
import { compareHash} from "../../../utils/security/hash.js";
import { generateToken} from "../../../utils/security/token.js";
import { emailEvent } from "../../../utils/events/email.event.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
 

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
