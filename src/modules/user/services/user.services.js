import userModel from "../../../DB/model/User.model.js";
import messageModel from "../../../DB/model/message.model.js";
import {
  asyncHandler,
  globalErrorHandling,
} from "../../../utils/errors/error.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { sucessResponseHandling } from "../../../utils/response/sucess.response.js";
import {
  generateDecrytion,
  generateEncrytion,
} from "../../../utils/security/encrytion.js";
import { compareHash, generateHash } from "../../../utils/security/hash.js";

// get profile
export const profile = asyncHandler(async (req, res, next) => {
  req.user.phone = generateDecrytion({ cipherText: req.user.phone });
  
  const messages=await messageModel.find({recipientId:req.user._id}).populate([{
    path:"recipientId",
    select:"-password"
  }])
  return sucessResponseHandling({
    res,
    message: "Profile",
    data: { user: req.user ,messages},
    
  });
});
//  share profile
export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.params.userId,
    isDeleted: false,
  }).select("userName email DOB image");

  return user
    ? sucessResponseHandling({
        res,
        message: "done",
        data: { user },
      })
    : next(new Error("in-valid account id", { cause: 404 }));
});
// update profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  return sucessResponseHandling({
    res,
    message: "updateProfile is done",
    data: { user },
  });
});
// updatePassword
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!compareHash({ plainText: oldPassword, hashValue: req.user.password })) {
    return next(new Error("in-valid old Password", { cause: 409 }));
  }
  const hashPassword = generateHash({ plainText: newPassword });
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { password: hashPassword, changePasswordTime: Date.now() },
    { new: true, runValidators: true }
  );
  return sucessResponseHandling({
    res,
    message: "updatePassword is done",
    data: { user },
  });
});
// updatePhone
export const updatePhone = asyncHandler(async (req, res, next) => {
  const { newPhone } = req.body;
  const updatePhone = generateEncrytion({ plainText: newPhone });
  const { phone } = await userModel.findById(req.user._id);

  if (newPhone == generateDecrytion({ cipherText: phone })) {
    return next(new Error("new phone number match with old phone number"));
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { phone: updatePhone },
    { new: true, runValidators: true }
  );
  user.phone = generateDecrytion({ cipherText: updatePhone });
  return sucessResponseHandling({
    res,
    message: "updatePhone is done",
    data: { user },
  });
});

// freeze profile
export const freezeProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { isDeleted: true, changePasswordTime: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );
  return sucessResponseHandling({
    res,
    message: "profile is freezed",
    data: { user },
  });
});

export const unFreezeProfile = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (await userModel.findOne({ email })) {
    emailEvent.emit("emailForActiveProfile", { email });
    return res.status(200).json({ message: "code is sent" });
  }
  return next(new Error("email not exist "));
});

export const reActiveProfile = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });
  if (user?.isDeleted) {
    if (compareHash({ plainText: otp, hashValue: user.reActiveProfileOTP })) {
      await userModel.updateOne({ email }, { isDeleted: false });
      return sucessResponseHandling({
        res,
        message: "profile is active now",
      });
    }
  }
  if (!user?.isDeleted) {
    return sucessResponseHandling({
      res,
      message: "profile is actived",
      // data:user._doc
    });
  }
  return next(new Error("error"));
});
