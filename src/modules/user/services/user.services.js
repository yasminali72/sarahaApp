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

  const messages = await messageModel
    .find({ recipientId: req.user._id })
    .populate([
      {
        path: "recipientId",
        select: "-password",
      },
    ]);
    const pinMessages = await messageModel
    .find({ recipientId: req.user._id ,pin:true})
    .populate([
      {
        path: "recipientId",
        select: "-password",
      },
    ]);
  return sucessResponseHandling({
    res,
    message: "Profile",
    data: { user: req.user, messages,numberOfAllMessages:messages.length,numberOfPinMessage:pinMessages.length },
  });
});
//  share profile
export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({
      _id: req.params.userId,
      isDeleted: false,
    })
    .select("userName email DOB image");

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
const {email}=req.body
if (email) {
  if (await userModel.findOne({email})) {
  return next(new Error("email is exist"))
  }
 const user= await userModel.findByIdAndUpdate(req.user._id,{email,changeCredentialTime:Date.now()})
  return sucessResponseHandling({res,message:"email is updated",data:{user}})
}
  const user= await userModel.findByIdAndUpdate(req.user._id, req.body, {
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
    { password: hashPassword, changeCredentialTime: Date.now() },
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
    { isDeleted: true, changeCredentialTime: Date.now() },
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
// active account
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
// delete one message
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  console.log(req.user);
  if (!(await messageModel.findById(messageId))) {
    return next(new Error("message not found"));
  }
  const message = await messageModel.deleteOne({ _id: messageId });
  console.log(message);
  const messages = await messageModel.find({ recipientId: req.user._id });
  console.log(messages);
  return sucessResponseHandling({
    res,
    message: "message is deleted",
    data: [{ messages }],
  });
});
// delete all messages
export const deleteAllMessages = asyncHandler(async (req, res, next) => {  
  await messageModel.deleteMany({ recipientId: req.user._id });
  return sucessResponseHandling({
    res,
    message: "all messages are deleted sucessful ",
   
  });
});
// forget password
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (await userModel.findOne({ email })) {
    emailEvent.emit("emailForVerifyCode", { email });
    return sucessResponseHandling({ res, message: "code is sent" });
  }
  return next(new Error("email not exist"));
});
export const verifyCode = asyncHandler(async (req, res, next) => {
  const { otp, email } = req.body;
  console.log(otp);
  const user = await userModel.findOne({ email });

  if (user) {
    if (compareHash({ plainText: otp, hashValue: user.verifyCode })) {
      await userModel.updateOne({ email }, { resetPassword: true });
      return sucessResponseHandling({ res, message: "code is sucess" });
    }
    return next(new Error("code is wrong"));
  }
  return next(new Error("email or code not correct"));
});
// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword, confirmationPassword } = req.body;
  const hashPassword = generateHash({ plainText: newPassword });
  const user = await userModel.findOne({ email });
  if (user) {
    if (user.resetPassword) {
      await userModel.findOneAndUpdate(
        { email },
        { password: hashPassword, resetPassword: false }
      );
      return sucessResponseHandling({ res, message: "password is updated" });
    }
    return next(new Error(" verify code first"));
  }

  return next(new Error("email not exist"));
});


// pin message
export const pinMessage=asyncHandler(async(req,res,next)=>{

  const {messageId}=req.params
  const message=await messageModel.findByIdAndUpdate(messageId,{pin:true},{new:true})

  if (!message) {
    return next(new Error("message not found"))
  }
  return sucessResponseHandling({res,message:"Message has been pinned successfully",data:{message}})
})

// pin message
export const unPinMessage=asyncHandler(async(req,res,next)=>{

  const {messageId}=req.params
  const message=await messageModel.findByIdAndUpdate(messageId,{pin:false},{new:true})

  if (!message) {
    return next(new Error("message not found"))
  }
  return sucessResponseHandling({res,message:"Message has been unPinned successfully",data:{message}})
})
